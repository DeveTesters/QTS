import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SurahSelector } from './components/SurahSelector';
import { FileUpload } from './components/FileUpload';
import { SRTDisplay } from './components/SRTDisplay';
import { SubscriptionModal } from './components/SubscriptionModal';
import { LoadingOverlay } from './components/LoadingOverlay';
import { useLanguage } from './hooks/useLanguage';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { useSurahs } from './hooks/useSurahs';
import { useSubscription } from './hooks/useSubscription';

function App() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, login, logout, isAuthenticated } = useAuth();
  const { surahs, selectedSurahs, selectSurah, removeSurah } = useSurahs();
  const { subscription, usage, checkLimits } = useSubscription();
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [srtFiles, setSrtFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [theme, language]);

  const handleFileUpload = async (file) => {
    if (!checkLimits('file')) {
      setShowSubscriptionModal(true);
      return;
    }

    setIsLoading(true);
    setLoadingMessage(language === 'ar' ? 'جاري معالجة الملف...' : 'Processing file...');
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add processed file to list
      const newSrtFile = {
        id: Date.now(),
        name: file.name,
        type: 'arabic',
        content: generateSampleSRT(),
        createdAt: new Date()
      };
      
      setSrtFiles(prev => [...prev, newSrtFile]);
      setCurrentView('srt-display');
    } catch (error) {
      console.error('File processing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleSRT = () => {
    return [
      {
        id: 1,
        startTime: '00:00:00,000',
        endTime: '00:00:03,000',
        text: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ',
        verseNumber: 1,
        hasError: false
      },
      {
        id: 2,
        startTime: '00:00:03,001',
        endTime: '00:00:06,000',
        text: 'ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ',
        verseNumber: 2,
        hasError: false
      }
    ];
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} subscription={subscription} usage={usage} />;
      case 'surah-selector':
        return (
          <SurahSelector
            surahs={surahs}
            selectedSurahs={selectedSurahs}
            onSelectSurah={selectSurah}
            onRemoveSurah={removeSurah}
            language={language}
          />
        );
      case 'file-upload':
        return (
          <FileUpload
            onFileUpload={handleFileUpload}
            language={language}
            canUpload={checkLimits('file')}
          />
        );
      case 'srt-display':
        return (
          <SRTDisplay
            srtFiles={srtFiles}
            language={language}
            onUpdateSRT={setSrtFiles}
          />
        );
      default:
        return <Dashboard user={user} subscription={subscription} usage={usage} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'ar' ? 'معالج ملفات SRT القرآنية' : 'Quran SRT Processor'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {language === 'ar' ? 'يرجى تسجيل الدخول للمتابعة' : 'Please login to continue'}
            </p>
          </div>
          
          <button
            onClick={() => login({ email: 'demo@example.com', name: 'Demo User' })}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {language === 'ar' ? 'تسجيل دخول تجريبي' : 'Demo Login'}
          </button>
          
          <div className="mt-4 flex justify-center">
            <button
              onClick={toggleLanguage}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {language === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header
        user={user}
        language={language}
        theme={theme}
        onToggleLanguage={toggleLanguage}
        onToggleTheme={toggleTheme}
        onLogout={logout}
      />
      
      <div className="flex">
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          language={language}
        />
        
        <main className="flex-1 p-6">
          {renderCurrentView()}
        </main>
      </div>
      
      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          language={language}
        />
      )}
      
      {isLoading && (
        <LoadingOverlay
          message={loadingMessage}
          language={language}
        />
      )}
    </div>
  );
}

export default App;