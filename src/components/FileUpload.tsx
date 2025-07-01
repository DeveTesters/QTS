import React, { useState, useRef } from 'react';
import { Upload, File, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  language: string;
  canUpload: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  language,
  canUpload
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!canUpload) {
      return;
    }

    const validTypes = ['.srt', '.txt', '.mp3', '.wav', '.m4a', '.flac'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      alert(language === 'ar' 
        ? 'نوع الملف غير مدعوم. يرجى اختيار ملف SRT أو ملف صوتي.'
        : 'Unsupported file type. Please choose an SRT or audio file.'
      );
      return;
    }

    setUploadedFile(file);
  };

  const handleUpload = () => {
    if (uploadedFile && canUpload) {
      onFileUpload(uploadedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-amiri">
          {language === 'ar' ? 'رفع الملفات' : 'Upload Files'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'ar' 
            ? 'ارفع ملفات SRT أو الملفات الصوتية للمعالجة'
            : 'Upload SRT files or audio files for processing'
          }
        </p>
      </div>

      {!canUpload && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300">
              {language === 'ar' 
                ? 'لقد وصلت إلى الحد الأقصى للرفع اليومي. يرجى الترقية للمتابعة.'
                : 'You have reached your daily upload limit. Please upgrade to continue.'
              }
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : canUpload
              ? 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
              : 'border-gray-200 dark:border-gray-700 opacity-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".srt,.txt,.mp3,.wav,.m4a,.flac"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={!canUpload}
          />
          
          <div className="space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              canUpload ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <Upload className={`w-8 h-8 ${
                canUpload ? 'text-primary-500' : 'text-gray-400'
              }`} />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {language === 'ar' 
                  ? 'اسحب الملفات هنا أو انقر للاختيار'
                  : 'Drag files here or click to select'
                }
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'ar' 
                  ? 'الصيغ المدعومة: SRT, TXT, MP3, WAV, M4A, FLAC'
                  : 'Supported formats: SRT, TXT, MP3, WAV, M4A, FLAC'
                }
              </p>
            </div>
          </div>
        </div>

        {uploadedFile && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <File className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleUpload}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {language === 'ar' ? 'معالجة' : 'Process'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};