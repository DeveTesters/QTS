import { useState } from 'react';

export const useSubscription = () => {
  const [subscription] = useState({
    plan: 'free',
    maxFiles: 5,
    maxMinutes: 30,
    maxUploadsPerDay: 3
  });

  const [usage] = useState({
    filesProcessed: 2,
    minutesUsed: 15,
    uploadsToday: 1
  });

  const checkLimits = (type: string) => {
    switch (type) {
      case 'file':
        return usage.uploadsToday < subscription.maxUploadsPerDay;
      case 'minutes':
        return usage.minutesUsed < subscription.maxMinutes;
      default:
        return true;
    }
  };

  return { subscription, usage, checkLimits };
};