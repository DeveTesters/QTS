import os
import whisper
import threading
import time

class AudioProcessor:
    def __init__(self):
        self.model = None
        self.model_path = os.path.join('models', 'whisper')
        self.loading_progress = 0
        self.loading_status = 'idle'  # idle, loading, loaded, error
        self.loading_message = ''
        self.processing_result = None
        self.processing_error = None
        self.processing_error_traceback = None
        
    def get_model_status(self):
        """Get current model status"""
        return {
            'status': self.loading_status,
            'progress': self.loading_progress,
            'message': self.loading_message,
            'processing_result': self.processing_result,
            'processing_error': self.processing_error,
            'processing_error_traceback': self.processing_error_traceback
        }
    
    def load_model_with_progress(self):
        """Load Whisper model with progress tracking"""
        try:
            self.loading_status = 'loading'
            self.loading_progress = 0
            self.loading_message = 'جاري تجميع الموارد...'
            
            # Create model directory
            os.makedirs(self.model_path, exist_ok=True)
            
            # Simulate progress
            for i in range(1, 11):
                time.sleep(0.5)
                self.loading_progress = i * 10
                if i <= 3:
                    self.loading_message = 'جاري تجميع الموارد...'
                elif i <= 7:
                    self.loading_message = 'جاري تحميل النموذج...'
                else:
                    self.loading_message = 'جاري تحضير النموذج...'
            
            # Actually load the model
            self.loading_message = 'جاري تحميل نموذج Whisper...'
            self.model = whisper.load_model("medium", download_root=self.model_path)
            
            self.loading_progress = 100
            self.loading_status = 'loaded'
            self.loading_message = 'تم تحميل النموذج بنجاح'
            
        except Exception as e:
            self.loading_status = 'error'
            self.loading_message = f'خطأ في تحميل النموذج: {str(e)}'
            self.loading_progress = 0
    
    def is_model_loaded(self):
        """Check if model is loaded"""
        return self.model is not None and self.loading_status == 'loaded'
    
    def process_audio_file(self, audio_path, selected_surahs, min_words, merge_enabled):
        """Process audio file to SRT"""
        if not self.is_model_loaded():
            raise Exception("النموذج غير محمل. يرجى تحميل النموذج أولاً.")
        
        # Transcribe audio
        result = self.model.transcribe(audio_path, language="ar", task="transcribe", verbose=False)
        
        # Create SRT content
        srt_content = self._create_srt_from_segments(result["segments"])
        
        # Save raw SRT
        base_name = os.path.splitext(os.path.basename(audio_path))[0]
        raw_srt_path = os.path.join('outputs', f'{base_name}_raw.srt')
        
        with open(raw_srt_path, 'w', encoding='utf-8') as f:
            f.write(srt_content)
        
        # Process with SRT processor
        from models.srt_processor import SRTProcessor
        srt_processor = SRTProcessor()
        processed_result = srt_processor.process_srt_file(
            raw_srt_path, selected_surahs, min_words, merge_enabled
        )
        
        return {
            'raw_srt_path': raw_srt_path,
            'processed_result': processed_result,
            'transcript': result["text"]
        }
    
    def _create_srt_from_segments(self, segments):
        """Create SRT content from Whisper segments"""
        srt_content = ""
        for index, seg in enumerate(segments, 1):
            srt_content += f"{index}\n"
            srt_content += f"{self._format_time(seg['start'])} --> {self._format_time(seg['end'])}\n"
            srt_content += f"{seg['text'].strip()}\n\n"
        return srt_content
    
    def _format_time(self, seconds):
        """Format seconds to SRT time format"""
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        ms = int((seconds % 1) * 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"