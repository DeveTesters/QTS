from flask import Flask, render_template, request, jsonify, send_file
from flask_cors import CORS
import os
import json
from controllers.main_controller import MainController
from controllers.api_controller import APIController

app = Flask(__name__)
CORS(app)

# Initialize controllers
main_controller = MainController()
api_controller = APIController()

# Register routes
@app.route('/')
def index():
    return main_controller.index()

@app.route('/api/surahs')
def get_surahs():
    return api_controller.get_surahs()

@app.route('/api/load_model', methods=['POST'])
def load_model():
    return api_controller.load_model()

@app.route('/api/upload_audio', methods=['POST'])
def upload_audio():
    return api_controller.upload_audio()

@app.route('/api/upload_srt', methods=['POST'])
def upload_srt():
    return api_controller.upload_srt()

@app.route('/api/process_audio', methods=['POST'])
def process_audio():
    return api_controller.process_audio()

@app.route('/api/process_srt', methods=['POST'])
def process_srt():
    return api_controller.process_srt()

@app.route('/api/download/<filename>')
def download_file(filename):
    return api_controller.download_file(filename)

@app.route('/api/model_status')
def model_status():
    return api_controller.get_model_status()

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('uploads', exist_ok=True)
    os.makedirs('outputs', exist_ok=True)
    os.makedirs('models', exist_ok=True)
    os.makedirs('data/json/surah', exist_ok=True)
    
    app.run(debug=True, host='0.0.0.0', port=5000)