import os
import re
import shutil
from collections import defaultdict
from Levenshtein import ratio
from models.quran_data import QuranDataModel

class SRTProcessor:
    def __init__(self):
        self.quran_model = QuranDataModel()
        
    def process_srt_file(self, srt_path, selected_surahs=None, min_words=5, merge_enabled=False):
        """Process SRT file to match with Quran verses"""
        # Create backup
        backup_path = self._create_backup(srt_path)
        
        # Read SRT segments
        segments = self._read_srt_file(srt_path)
        
        # Load Quran data
        all_verses = self.quran_model.load_all_verses()
        surahs_metadata = self.quran_model.get_all_surahs()
        
        # Match segments to Quran
        grouped = self._match_segments_to_surah(segments, all_verses, selected_surahs)
        
        # Flatten and sort segments
        all_segments = []
        for surah_num in grouped:
            all_segments.extend(grouped[surah_num])
        all_segments.sort(key=lambda x: x["segment"]["start"])
        
        # Merge segments if enabled
        if merge_enabled:
            all_segments = self._merge_segments(all_segments, all_verses, min_words)
        
        # Write processed SRT
        processed_srt_path = self._write_processed_srt(srt_path, all_segments, grouped)
        
        # Create ranges file
        ranges_path = self._create_ranges_file(srt_path, grouped, surahs_metadata)
        
        return {
            'processed_srt_path': processed_srt_path,
            'ranges_path': ranges_path,
            'backup_path': backup_path,
            'grouped_segments': grouped,
            'total_segments': len(all_segments)
        }
    
    def _create_backup(self, srt_path):
        """Create backup of original SRT file"""
        if not srt_path.endswith("_backup.srt"):
            backup_path = os.path.splitext(srt_path)[0] + "_backup.srt"
        else:
            backup_path = srt_path
        
        shutil.copy(srt_path, backup_path)
        return backup_path
    
    def _read_srt_file(self, srt_path):
        """Read SRT file and return segments"""
        segments = []
        with open(srt_path, 'r', encoding='utf-8') as f:
            lines = f.read().strip().split('\n\n')
            for block in lines:
                block_lines = block.split('\n')
                if len(block_lines) >= 3:
                    index = block_lines[0].strip()
                    timing = block_lines[1].strip()
                    text = ' '.join(block_lines[2:]).strip()
                    start_time, end_time = timing.split(' --> ')
                    segments.append({
                        'index': int(index),
                        'start': self._parse_time(start_time),
                        'end': self._parse_time(end_time),
                        'text': text
                    })
        return sorted(segments, key=lambda x: x['start'])
    
    def _parse_time(self, time_str):
        """Parse SRT time format to seconds"""
        h, m, s_ms = time_str.split(':')
        s, ms = s_ms.replace(',', '.').split('.')
        return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000
    
    def _format_time(self, seconds):
        """Format seconds to SRT time format"""
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        ms = int((seconds % 1) * 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"
    
    def _word_by_word_match(self, seg_words, verse_words, min_match_ratio=0.8):
        """Match segment words to verse words with partial matching"""
        matches = 0
        for seg_word in seg_words:
            for verse_word in verse_words:
                if ratio(seg_word, verse_word) > min_match_ratio:
                    matches += 1
                    break
        return matches / max(len(seg_words), 1)
    
    def _match_segments_to_surah(self, segments, all_verses, selected_surahs=None):
        """Match SRT segments to Quranic surahs sequentially"""
        grouped = defaultdict(list)
        used_segments = set()
        segment_index = 0
        detected_surah = None
        current_ayah = 1
        ayah_tracker = {}
        
        # Detect surah if not selected
        if not selected_surahs:
            best_score = 0
            best_surah = None
            for surah_num in range(1, min(115, len(all_verses) + 1)):
                if surah_num not in all_verses:
                    continue
                verses = all_verses[surah_num]
                for ayah_num, verse in enumerate(verses, 1):
                    verse_text = self.quran_model.normalize_text(verse["text"]["ar"])
                    for seg in segments:
                        seg_text = self.quran_model.normalize_text(seg["text"])
                        score = ratio(seg_text, verse_text)
                        if score > best_score and score > 0.75:
                            best_score = score
                            best_surah = surah_num
            detected_surah = best_surah
            selected_surahs = [detected_surah] if detected_surah else [1]
        
        # Main matching logic (simplified version of the original)
        while segment_index < len(segments):
            if segment_index in used_segments:
                segment_index += 1
                continue
            
            seg = segments[segment_index]
            seg_text = self.quran_model.normalize_text(seg["text"])
            seg_words = seg_text.split()
            best_score = 0
            best_text = seg["text"] + " (غير مطابق)"
            best_ayah = 0
            best_surah = 0
            matched_indices = [segment_index]
            
            for surah_num in selected_surahs:
                if surah_num not in all_verses:
                    continue
                verses = all_verses[surah_num]
                for ayah_num in range(max(1, current_ayah - 1), min(current_ayah + 3, len(verses) + 1)):
                    if (surah_num, ayah_num) in ayah_tracker and ayah_tracker[(surah_num, ayah_num)] > 2:
                        continue
                    
                    if ayah_num > len(verses):
                        continue
                        
                    verse = verses[ayah_num - 1]
                    verse_text = self.quran_model.normalize_text(verse["text"]["ar"])
                    verse_text_with_tashkeel = verse["text"]["ar"]
                    verse_words = verse_text.split()
                    
                    score = ratio(seg_text, verse_text)
                    word_score = self._word_by_word_match(seg_words, verse_words)
                    total_score = (score * 0.7 + word_score * 0.3)
                    
                    if total_score > best_score and total_score > 0.75:
                        best_score = total_score
                        best_text = verse_text_with_tashkeel
                        best_ayah = ayah_num
                        best_surah = surah_num
                        matched_indices = [segment_index]
            
            if best_score > 0.75:
                grouped[best_surah].append({
                    "segment": seg,
                    "match": {
                        "surah": best_surah,
                        "ayah": best_ayah,
                        "match_text": best_text
                    }
                })
                used_segments.add(segment_index)
                ayah_tracker[(best_surah, best_ayah)] = ayah_tracker.get((best_surah, best_ayah), 0) + 1
                current_ayah = best_ayah + 1
            else:
                grouped[0].append({
                    "segment": seg,
                    "match": {
                        "surah": 0,
                        "ayah": 0,
                        "match_text": seg["text"] + " (غير مطابق)"
                    }
                })
                used_segments.add(segment_index)
            
            segment_index += 1
        
        return grouped
    
    def _merge_segments(self, segments, all_verses, min_words=5, max_time_gap=1.0):
        """Merge segments to ensure minimum words per line"""
        merged = []
        i = 0
        
        while i < len(segments):
            current = segments[i]
            current_text = current["match"].get("match_text", current["segment"]["text"] + " (غير مطابق)")
            current_words = len(current_text.split())
            combined_texts = [(current_text, current["match"]["ayah"], current["match"]["surah"])]
            combined_start = current["segment"]["start"]
            combined_end = current["segment"]["end"]
            j = i + 1
            
            while j < len(segments) and current_words < min_words:
                next_seg = segments[j]
                time_gap = next_seg["segment"]["start"] - combined_end
                if time_gap > max_time_gap:
                    break
                
                next_text = next_seg["match"].get("match_text", next_seg["segment"]["text"] + " (غير مطابق)")
                next_words = len(next_text.split())
                next_ayah = next_seg["match"]["ayah"]
                next_surah = next_seg["match"]["surah"]
                
                if next_ayah != combined_texts[-1][1] and current_words >= min_words:
                    break
                
                combined_texts.append((next_text, next_ayah, next_surah))
                combined_end = next_seg["segment"]["end"]
                current_words += next_words
                j += 1
            
            merged.append({
                "segment": {
                    "index": current["segment"]["index"],
                    "start": combined_start,
                    "end": combined_end,
                    "text": current["segment"]["text"]
                },
                "match": {
                    "surahs": [t[2] for t in combined_texts],
                    "ayahs": [t[1] for t in combined_texts],
                    "match_texts": [t[0] for t in combined_texts]
                }
            })
            
            i = j
        
        return merged
    
    def _write_processed_srt(self, srt_path, all_segments, grouped):
        """Write processed SRT file"""
        processed_path = os.path.splitext(srt_path)[0] + "_processed.srt"
        
        with open(processed_path, 'w', encoding='utf-8') as f:
            index = 1
            ayah_counts = defaultdict(int)
            
            for surah_num in grouped:
                for item in grouped[surah_num]:
                    ayah_counts[(surah_num, item["match"]["ayah"])] += 1
            
            for segment in all_segments:
                texts = segment["match"].get("match_texts", [segment["match"].get("match_text", segment["segment"].get("text", "") + " (غير مطابق)")])
                ayahs = segment["match"].get("ayahs", [segment["match"].get("ayah", 0)])
                surahs = segment["match"].get("surahs", [segment["match"].get("surah", 0)])
                text = ""
                
                for t, ayah, surah_num in zip(texts, ayahs, surahs):
                    if surah_num == 0 or "(غير مطابق)" in t:
                        text += t + " "
                        continue
                    
                    if surah_num == 1:  # Al-Fatihah
                        if ayah == 1:
                            text += t + " "
                            continue
                        elif ayah <= 6:
                            ayah_num = self.quran_model.to_arabic_number(ayah - 1)
                            text += f"{t} ﴿{ayah_num}﴾ "
                        else:
                            if ayah_counts[(surah_num, ayah)] > 1:
                                segment_count = sum(1 for i in grouped[surah_num] if i["match"]["ayah"] == ayah and i["segment"]["start"] <= segment["segment"]["start"])
                                if segment_count == ayah_counts[(surah_num, ayah)]:
                                    text += f"{t} ﴿٦﴾ "
                                else:
                                    text += t + " "
                            else:
                                text += f"{t} ﴿٦﴾ "
                    else:
                        ayah_num = self.quran_model.to_arabic_number(ayah)
                        text += f"{t} ﴿{ayah_num}﴾ "
                
                text = text.strip()
                
                f.write(f"{index}\n")
                f.write(f"{self._format_time(segment['segment']['start'])} --> {self._format_time(segment['segment']['end'])}\n")
                f.write(f"{text}\n\n")
                index += 1
        
        return processed_path
    
    def _create_ranges_file(self, srt_path, grouped, surahs_metadata):
        """Create surah ranges file"""
        ranges_path = os.path.splitext(srt_path)[0] + "_sura_ranges.txt"
        
        with open(ranges_path, 'w', encoding='utf-8') as f:
            for surah_num in sorted(grouped):
                if surah_num == 0 or surah_num > len(surahs_metadata):
                    continue
                
                items = grouped[surah_num]
                if items:
                    start = min(item["segment"]["start"] for item in items)
                    end = max(item["segment"]["end"] for item in items)
                    
                    try:
                        surah_name = surahs_metadata[surah_num-1]["name"]["ar"]
                        f.write(f"{surah_name}: {self._format_time(start)} --> {self._format_time(end)}\n")
                    except IndexError:
                        continue
        
        return ranges_path