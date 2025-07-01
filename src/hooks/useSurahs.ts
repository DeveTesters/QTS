import { useState, useEffect } from 'react';

export const useSurahs = () => {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurahs, setSelectedSurahs] = useState([]);

  useEffect(() => {
    // Load sample surah data
    const sampleSurahs = [
      {
        number: 1,
        name: {
          ar: "الفاتحة",
          en: "The Opening",
          transliteration: "Al-Fatihah"
        },
        revelation_place: {
          ar: "مكية",
          en: "meccan"
        },
        verses_count: 7,
        words_count: 29,
        letters_count: 139
      },
      {
        number: 2,
        name: {
          ar: "البقرة",
          en: "The Cow",
          transliteration: "Al-Baqarah"
        },
        revelation_place: {
          ar: "مدنية",
          en: "medinan"
        },
        verses_count: 286,
        words_count: 6144,
        letters_count: 25613
      }
    ];
    setSurahs(sampleSurahs);
  }, []);

  const selectSurah = (surah: any) => {
    if (!selectedSurahs.find(s => s.number === surah.number)) {
      setSelectedSurahs(prev => [...prev, surah]);
    }
  };

  const removeSurah = (surahNumber: number) => {
    setSelectedSurahs(prev => prev.filter(s => s.number !== surahNumber));
  };

  return { surahs, selectedSurahs, selectSurah, removeSurah };
};