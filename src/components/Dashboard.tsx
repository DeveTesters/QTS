import React from 'react';
import { FileText, Clock, Upload, CheckCircle } from 'lucide-react';

interface DashboardProps {
  user: any;
  subscription: any;
  usage: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, subscription, usage }) => {
  const stats = [
    {
      icon: FileText,
      label: 'Files Processed',
      value: usage?.filesProcessed || 0,
      limit: subscription?.maxFiles || 10,
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      label: 'Minutes Used',
      value: usage?.minutesUsed || 0,
      limit: subscription?.maxMinutes || 60,
      color: 'text-green-600'
    },
    {
      icon: Upload,
      label: 'Uploads Today',
      value: usage?.uploadsToday || 0,
      limit: subscription?.maxUploadsPerDay || 5,
      color: 'text-purple-600'
    },
    {
      icon: CheckCircle,
      label: 'Success Rate',
      value: '98%',
      limit: null,
      color: 'text-emerald-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-amiri">
          مرحباً بك في معالج ملفات SRT القرآنية
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          أداة احترافية لمعالجة وتحرير ملفات الترجمة للآيات القرآنية
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const percentage = stat.limit ? (stat.value / stat.limit) * 100 : 100;
          
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-700 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {stat.limit && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.value}/{stat.limit}
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {stat.label}
              </p>
              
              {stat.limit && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 font-amiri">
            الميزات الرئيسية
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-3 rtl:space-x-reverse">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">معالجة ملفات SRT تلقائياً</span>
            </li>
            <li className="flex items-center space-x-3 rtl:space-x-reverse">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">تصحيح الأخطاء والتشكيل</span>
            </li>
            <li className="flex items-center space-x-3 rtl:space-x-reverse">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">دعم الترجمة الإنجليزية</span>
            </li>
            <li className="flex items-center space-x-3 rtl:space-x-reverse">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 dark:text-gray-300">تحرير وتعديل الملفات</span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Al-Fatihah.srt</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <FileText className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Al-Baqarah.srt</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};