'use client';

import { useEffect } from 'react';

const TawkToScript = () => {
  useEffect(() => {
    // Prevent loading multiple times
    if (document.getElementById('tawk-script')) {
      console.log('[FPX Markets - Tawk.to] Tawk.to script already present.');
      return;
    }

    console.log('[FPX Markets - Tawk.to] Dynamically adding Tawk.to script...');
    const script = document.createElement('script');
    script.id = 'tawk-script';
    script.src = 'https://embed.tawk.to/6854ad05a39e6f190afdf00c/1iu5c7o0v';
    script.async = true;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    script.onload = () => {
      console.log(
        '[FPX Markets - Tawk.to] Tawk.to script loaded successfully via dynamic append.'
      );
    };
    script.onerror = () => {
      console.error(
        '[FPX Markets - Tawk.to] Failed to load Tawk.to script via dynamic append.'
      );
    };

    document.body.appendChild(script);

  }, []);

  return null; // This component doesn't render anything itself
};

export default TawkToScript;
