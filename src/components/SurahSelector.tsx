import React, { useState } from 'react';
import { Search, Plus, X, BookOpen } from 'lucide-react';

interface SurahSelectorProps {
  surahs: any[];
  selectedSurahs: any[];
  onSelectSurah: (surah: any) => void;
  onRemoveSurah: (surahId: number) => void;
  language: string;
}

export const SurahSelector: React.FC<SurahSelectorProps> = ({
  surahs,
  selectedSurahs,
  onSelectSurah,
  onRemoveSurah,
  language
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSurahId, setSelectedSurahId] = useState('');

  const filteredSurahs = surahs.filter(surah =>
    surah.name.ar.includes(searchTerm) ||
    surah.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.name.transliteration.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSurah = () => {
    const surah = surahs.find(s => s.number === parseInt(selectedSurahId));
    if (surah && !selectedSurahs.find(s => s.number === surah.number)) {
      onSelectSurah(surah);
      setSelectedSurahId('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-amiri">
          {language === 'ar' ? 'اختيار السور' : 'Select Surahs'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'ar' 
            ? 'اختر السور التي تريد معالجة ملفات SRT الخاصة بها'
            : 'Choose the surahs you want to process SRT files for'
          }
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={language === 'ar' ? 'ابحث عن السورة...' : 'Search for surah...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedSurahId}
              onChange={(e) => setSelectedSurahId(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">
                {language === 'ar' ? 'اختر سورة' : 'Select Surah'}
              </option>
              {filteredSurahs.map(surah => (
                <option key={surah.number} value={surah.number}>
                  {language === 'ar' ? surah.name.ar : surah.name.en}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleAddSurah}
              disabled={!selectedSurahId}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {language === 'ar' ? 'إضافة' : 'Add'}
            </button>
          </div>
        </div>

        {selectedSurahs.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-amiri">
              {language === 'ar' ? 'السور المختارة' : 'Selected Surahs'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedSurahs.map(surah => (
                <div
                  key={surah.number}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {surah.number}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white font-amiri">
                        {language === 'ar' ? surah.name.ar : surah.name.en}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {surah.verses_count} {language === 'ar' ? 'آية' : 'verses'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveSurah(surah.number)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedSurahs.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {language === 'ar' 
                ? 'لم يتم اختيار أي سورة بعد'
                : 'No surahs selected yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};