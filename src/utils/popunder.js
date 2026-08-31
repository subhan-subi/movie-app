import { Capacitor } from '@capacitor/core';

export const loadPopunderAd = () => {
  if (Capacitor.isNativePlatform()) {
    // Duplicate insertion se bachne ke liye check
    if (!document.getElementById('adsterra-popunder')) {
      const script = document.createElement('script');
      script.id = 'adsterra-popunder';
      script.src = 'https://pl31096551.profitableratecpmnetwork.com/c9/ae/9c/c9ae9cccec566f5f5540ef362a4f87a2.js';
      script.type = 'text/javascript';
      document.body.appendChild(script);
    }
  }
};