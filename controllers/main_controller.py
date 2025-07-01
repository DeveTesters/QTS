from flask import render_template
import os

class MainController:
    def __init__(self):
        pass
    
    def index(self):
        """Render the main application page"""
        return render_template('index.html')