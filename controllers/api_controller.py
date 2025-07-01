from flask import request, jsonify, send_file
import os
import json
import threading
from models.quran_data import QuranDataModel
from models.audio_processor import AudioProcessor
from models.srt_processor import SRTProcessor
from werkzeug.utils import secure_filename
import traceback

class APIController:
    def __init__(self):
        self.quran_model = QuranDataModel()
        self.audio_processor = AudioProcessor()
        self.srt_processor = SRTProcessor()
        self.upload_folder = 'uploads'
        self.output_folder = 'outputs'
        
    def get_surahs(self):
        """Get all surahs data"""
        try:
            surahs = self.quran_model.get_all_surahs()
            return jsonify({'success': True, 'data': surahs})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
    
    def load_model(self):
        """Load Whisper model"""
        try:
            def load_with_progress():
                self.audio_processor.load_model_with_progress()
            
            thread = threading.Thread(target=load_with_progress)
            thread.start()
            
            return jsonify({'success': True, 'message': 'Model loading started'})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
    
    def get_model_status(self):
        """Get model loading status"""
        try:
            status = self.audio_processor.get_model_status()
            return jsonify({'success': True, 'data': status})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
    
    def upload_audio(self):
        """Handle audio file upload"""
        try:
            if 'file' not in request.files:
                return jsonify({'success': False, 'error': 'No file provided'})
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'success': False, 'error': 'No file selected'})
            
            filename = secure_filename(file.filename)
            filepath = os.path.join(self.upload_folder, filename)
            file.save(filepath)
            
            return jsonify({'success': True, 'filename': filename, 'filepath': filepath})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
    
    def upload_srt(self):
        """Handle SRT file upload"""
        try:
            if 'file' not in request.files:
                return jsonify({'success': False, 'error': 'No file provided'})
            
            file = request.files['file']
            if file.filename == '':
                return jsonify({'success': False, 'error': 'No file selected'})
            
            filename = secure_filename(file.filename)
            filepath = os.path.join(self.upload_folder, filename)
            file.save(filepath)
            
            return jsonify({'success': True, 'filename': filename, 'filepath': filepath})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
    
    def process_audio(self):
        """Process audio file to SRT"""
        try:
            data = request.get_json()
            filepath = data.get('filepath')
            selected_surahs = data.get('selected_surahs', [])
            min_words = data.get('min_words', 5)
            merge_enabled = data.get('merge_enabled', False)
            
            if not filepath or not os.path.exists(filepath):
                return jsonify({'success': False, 'error': 'File not found'})
            
            # Start processing in background
            def process():
                try:
                    result = self.audio_processor.process_audio_file(
                        filepath, selected_surahs, min_words, merge_enabled
                    )
                    self.audio_processor.processing_result = result
                except Exception as e:
                    self.audio_processor.processing_error = str(e)
                    self.audio_processor.processing_error_traceback = traceback.format_exc()
            
            thread = threading.Thread(target=process)
            thread.start()
            
            return jsonify({'success': True, 'message': 'Processing started'})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
    
    def process_srt(self):
        """Process SRT file"""
        try:
            data = request.get_json()
            filepath = data.get('filepath')
            selected_surahs = data.get('selected_surahs', [])
            min_words = data.get('min_words', 5)
            merge_enabled = data.get('merge_enabled', False)
            
            if not filepath or not os.path.exists(filepath):
                return jsonify({'success': False, 'error': 'File not found'})
            
            result = self.srt_processor.process_srt_file(
                filepath, selected_surahs, min_words, merge_enabled
            )
            
            return jsonify({'success': True, 'data': result})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e), 'traceback': traceback.format_exc()})
    
    def download_file(self, filename):
        """Download processed file"""
        try:
            filepath = os.path.join(self.output_folder, filename)
            if os.path.exists(filepath):
                return send_file(filepath, as_attachment=True)
            else:
                return jsonify({'success': False, 'error': 'File not found'})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})