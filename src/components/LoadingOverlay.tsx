import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message: string;
  language: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message,
  language
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400">
          {message}
        </p>
        
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-primary-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );
};