import React from 'react';
import { Moon, Sun, Globe, User, LogOut } from 'lucide-react';

interface HeaderProps {
  user: any;
  language: string;
  theme: string;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  language,
  theme,
  onToggleLanguage,
  onToggleTheme,
  onLogout
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white font-amiri">
                {language === 'ar' ? 'معالج ملفات SRT القرآنية' : 'Quran SRT Processor'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'أداة احترافية لمعالجة ملفات الترجمة' : 'Professional SRT Processing Tool'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            
            <button
              onClick={onToggleLanguage}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Toggle Language"
            >
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="text-right rtl:text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'Demo User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'ar' ? 'مستخدم مجاني' : 'Free User'}
                </p>
              </div>
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};