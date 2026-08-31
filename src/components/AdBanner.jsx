import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export function AdBanner() {
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    // Sirf mobile APK ke andar chalega
    if (isNative) {
      const script = document.createElement('script');
      script.src = 'https://pl31096552.profitableratecpmnetwork.com/32975a9a1582bc9caf54d170f179ec23/invoke.js';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');

      const container = document.getElementById('container-32975a9a1582bc9caf54d170f179ec23');
      if (container && container.childElementCount === 0) {
        container.appendChild(script);
      }
    }
  }, [isNative]);

  // Vercel / Web Browser par hide rahega
  if (!isNative) return null;

  return (
    <div className="my-3 text-center d-flex justify-content-center">
      <div id="container-32975a9a1582bc9caf54d170f179ec23"></div>
    </div>
  );
}