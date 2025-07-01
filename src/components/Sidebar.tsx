import React from 'react';
import { LayoutDashboard, BookOpen, Upload, FileText, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  language: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  language
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: language === 'ar' ? 'لوحة التحكم' : 'Dashboard'
    },
    {
      id: 'surah-selector',
      icon: BookOpen,
      label: language === 'ar' ? 'اختيار السور' : 'Select Surahs'
    },
    {
      id: 'file-upload',
      icon: Upload,
      label: language === 'ar' ? 'رفع الملفات' : 'Upload Files'
    },
    {
      id: 'srt-display',
      icon: FileText,
      label: language === 'ar' ? 'ملفات SRT' : 'SRT Files'
    },
    {
      id: 'settings',
      icon: Settings,
      label: language === 'ar' ? 'الإعدادات' : 'Settings'
    }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};