import os
import json
import re

class QuranDataModel:
    def __init__(self):
        self.surahs_file = self._get_surahs_file_path()
        self.surah_data_path = self._get_surah_data_path()
        self.surahs_metadata = None
        self.all_verses = None
        
    def _get_surahs_file_path(self):
        """Get the path to surahs.json file"""
        return os.path.join('data', 'surahs.json')
    
    def _get_surah_data_path(self):
        """Get the path to surah data directory"""
        return os.path.join('data', 'json', 'surah')
    
    def _create_sample_data(self):
        """Create sample Quran data if not exists"""
        # Create directories
        os.makedirs(os.path.dirname(self.surahs_file), exist_ok=True)
        os.makedirs(self.surah_data_path, exist_ok=True)
        
        # Create sample surahs.json
        if not os.path.exists(self.surahs_file):
            sample_surahs = {
                "result": [
                    {
                        "id": 1,
                        "name": {
                            "ar": "الفاتحة",
                            "en": "Al-Fatihah"
                        },
                        "verses_count": 7
                    },
                    {
                        "id": 2,
                        "name": {
                            "ar": "البقرة",
                            "en": "Al-Baqarah"
                        },
                        "verses_count": 286
                    }
                ]
            }
            
            with open(self.surahs_file, 'w', encoding='utf-8') as f:
                json.dump(sample_surahs, f, ensure_ascii=False, indent=2)
        
        # Create sample surah files
        sample_fatihah = {
            "verses": [
                {"text": {"ar": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"}},
                {"text": {"ar": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"}},
                {"text": {"ar": "الرَّحْمَٰنِ الرَّحِيمِ"}},
                {"text": {"ar": "مَالِكِ يَوْمِ الدِّينِ"}},
                {"text": {"ar": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"}},
                {"text": {"ar": "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ"}},
                {"text": {"ar": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"}}
            ]
        }
        
        fatihah_path = os.path.join(self.surah_data_path, 'surah_1.json')
        if not os.path.exists(fatihah_path):
            with open(fatihah_path, 'w', encoding='utf-8') as f:
                json.dump(sample_fatihah, f, ensure_ascii=False, indent=2)
    
    def get_all_surahs(self):
        """Get all surahs metadata"""
        if self.surahs_metadata is None:
            self._create_sample_data()
            try:
                with open(self.surahs_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.surahs_metadata = data.get('result', [])
            except FileNotFoundError:
                self.surahs_metadata = []
        
        return self.surahs_metadata
    
    def load_all_verses(self):
        """Load all verses from JSON files"""
        if self.all_verses is None:
            self.all_verses = {}
            surahs = self.get_all_surahs()
            
            for surah in surahs:
                surah_id = surah['id']
                surah_file = os.path.join(self.surah_data_path, f'surah_{surah_id}.json')
                
                if os.path.exists(surah_file):
                    try:
                        with open(surah_file, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                            self.all_verses[surah_id] = data.get('verses', [])
                    except Exception as e:
                        print(f"Error loading surah {surah_id}: {e}")
                        self.all_verses[surah_id] = []
                else:
                    self.all_verses[surah_id] = []
        
        return self.all_verses
    
    @staticmethod
    def normalize_text(text):
        """Normalize Arabic text by removing diacritics and extra spaces"""
        text = re.sub(r'[\u064B-\u065F\u0670]', '', text)  # Remove diacritics
        text = re.sub(r'\s+', ' ', text).strip()  # Normalize spaces
        return text
    
    @staticmethod
    def to_arabic_number(num):
        """Convert English number to Arabic-Indic number"""
        arabic_digits = '٠١٢٣٤٥٦٧٨٩'
        return ''.join(arabic_digits[int(d)] for d in str(num))