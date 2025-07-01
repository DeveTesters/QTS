import { useState, useEffect } from 'react';

export const useLanguage = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ar';
  });

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  return { language, toggleLanguage };
};