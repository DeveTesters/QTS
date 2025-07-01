import React from 'react';
import { X, Crown, Check } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
  language: string;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  onClose,
  language
}) => {
  const plans = [
    {
      name: language === 'ar' ? 'الخطة الأساسية' : 'Basic Plan',
      price: '$9.99',
      period: language === 'ar' ? 'شهرياً' : 'per month',
      features: [
        language === 'ar' ? '50 ملف شهرياً' : '50 files per month',
        language === 'ar' ? '120 دقيقة معالجة' : '120 minutes processing',
        language === 'ar' ? 'دعم فني أساسي' : 'Basic support',
        language === 'ar' ? 'تصدير ملفات SRT' : 'SRT file export'
      ]
    },
    {
      name: language === 'ar' ? 'الخطة المتقدمة' : 'Pro Plan',
      price: '$19.99',
      period: language === 'ar' ? 'شهرياً' : 'per month',
      features: [
        language === 'ar' ? '200 ملف شهرياً' : '200 files per month',
        language === 'ar' ? '500 دقيقة معالجة' : '500 minutes processing',
        language === 'ar' ? 'دعم فني متقدم' : 'Priority support',
        language === 'ar' ? 'تصحيح الأخطاء التلقائي' : 'Auto error correction',
        language === 'ar' ? 'ترجمة إنجليزية' : 'English translation'
      ],
      popular: true
    },
    {
      name: language === 'ar' ? 'الخطة الاحترافية' : 'Enterprise Plan',
      price: '$49.99',
      period: language === 'ar' ? 'شهرياً' : 'per month',
      features: [
        language === 'ar' ? 'ملفات غير محدودة' : 'Unlimited files',
        language === 'ar' ? 'معالجة غير محدودة' : 'Unlimited processing',
        language === 'ar' ? 'دعم فني مخصص' : 'Dedicated support',
        language === 'ar' ? 'API متقدم' : 'Advanced API',
        language === 'ar' ? 'تخصيص كامل' : 'Full customization'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-amiri">
                {language === 'ar' ? 'خطط الاشتراك' : 'Subscription Plans'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {language === 'ar' 
                  ? 'اختر الخطة المناسبة لاحتياجاتك'
                  : 'Choose the plan that fits your needs'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  plan.popular
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Crown className="w-4 h-4" />
                      {language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-primary-500 mb-1">
                    {plan.price}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {plan.period}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-primary-500 hover:bg-primary-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                  }`}
                >
                  {language === 'ar' ? 'اختيار الخطة' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {language === 'ar' 
                ? 'لديك مفتاح تفعيل؟'
                : 'Have an activation key?'
              }
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                placeholder={language === 'ar' ? 'أدخل مفتاح التفعيل' : 'Enter activation key'}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                {language === 'ar' ? 'تفعيل' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};