import React, { useState } from 'react';
import { FileText, Download, Edit, AlertTriangle, CheckCircle, Eye } from 'lucide-react';

interface SRTDisplayProps {
  srtFiles: any[];
  language: string;
  onUpdateSRT: (files: any[]) => void;
}

export const SRTDisplay: React.FC<SRTDisplayProps> = ({
  srtFiles,
  language,
  onUpdateSRT
}) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const handleLineSelect = (lineId: number) => {
    setSelectedLines(prev => 
      prev.includes(lineId) 
        ? prev.filter(id => id !== lineId)
        : [...prev, lineId]
    );
  };

  const handleMergeLines = () => {
    if (selectedLines.length < 2 || !selectedFile) return;

    const sortedLines = selectedLines.sort((a, b) => a - b);
    const linesToMerge = selectedFile.content.filter((line: any) => 
      sortedLines.includes(line.id)
    );

    const mergedLine = {
      id: sortedLines[0],
      startTime: linesToMerge[0].startTime,
      endTime: linesToMerge[linesToMerge.length - 1].endTime,
      text: linesToMerge.map((line: any) => line.text).join(' '),
      verseNumber: linesToMerge[0].verseNumber,
      hasError: false
    };

    const newContent = selectedFile.content
      .filter((line: any) => !sortedLines.includes(line.id))
      .concat(mergedLine)
      .sort((a: any, b: any) => a.id - b.id);

    const updatedFile = { ...selectedFile, content: newContent };
    const updatedFiles = srtFiles.map(file => 
      file.id === selectedFile.id ? updatedFile : file
    );

    onUpdateSRT(updatedFiles);
    setSelectedFile(updatedFile);
    setSelectedLines([]);
  };

  const handleDownload = (file: any) => {
    const srtContent = file.content
      .map((line: any, index: number) => 
        `${index + 1}\n${line.startTime} --> ${line.endTime}\n${line.text}\n`
      )
      .join('\n');

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const checkErrors = (file: any) => {
    // Simulate error checking
    const updatedContent = file.content.map((line: any, index: number) => ({
      ...line,
      hasError: Math.random() > 0.8 // Random errors for demo
    }));

    const updatedFile = { ...file, content: updatedContent };
    const updatedFiles = srtFiles.map(f => 
      f.id === file.id ? updatedFile : f
    );

    onUpdateSRT(updatedFiles);
    setShowErrors(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-amiri">
          {language === 'ar' ? 'ملفات SRT' : 'SRT Files'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'ar' 
            ? 'عرض وتحرير ملفات SRT المعالجة'
            : 'View and edit processed SRT files'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'ar' ? 'الملفات' : 'Files'}
            </h3>
            
            {srtFiles.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  {language === 'ar' ? 'لا توجد ملفات' : 'No files yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {srtFiles.map(file => (
                  <div
                    key={file.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedFile?.id === file.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedFile(file)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        file.type === 'arabic' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {file.type === 'arabic' ? 'عربي' : 'English'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {file.content.length} {language === 'ar' ? 'سطر' : 'lines'}
                    </p>
                    
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file);
                        }}
                        className="flex-1 px-3 py-1 text-xs bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors"
                      >
                        <Download className="w-3 h-3 inline mr-1" />
                        {language === 'ar' ? 'تحميل' : 'Download'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          checkErrors(file);
                        }}
                        className="flex-1 px-3 py-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                      >
                        <Eye className="w-3 h-3 inline mr-1" />
                        {language === 'ar' ? 'فحص' : 'Check'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* File Content */}
        <div className="lg:col-span-2">
          {selectedFile ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedFile.name}
                </h3>
                
                <div className="flex gap-2">
                  {selectedLines.length > 1 && (
                    <button
                      onClick={handleMergeLines}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      {language === 'ar' ? 'دمج الأسطر' : 'Merge Lines'}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedFile.content.map((line: any) => (
                  <div
                    key={line.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      line.hasError
                        ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                        : selectedLines.includes(line.id)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedLines.includes(line.id)}
                        onChange={() => handleLineSelect(line.id)}
                        className="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {line.startTime} → {line.endTime}
                          </span>
                          {line.hasError && (
                            <div className="flex items-center gap-1 text-red-500">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="text-xs">
                                {language === 'ar' ? 'خطأ' : 'Error'}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-gray-900 dark:text-white font-amiri leading-relaxed">
                          {line.text}
                        </p>
                        
                        {line.verseNumber && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                            {language === 'ar' ? 'آية' : 'Verse'} {line.verseNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {language === 'ar' 
                    ? 'اختر ملفاً لعرض محتواه'
                    : 'Select a file to view its content'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};