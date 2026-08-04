'use client';

import { useEffect } from 'react';

/**
 * TawkMessenger component
 * Handles the client-side initialization of the Tawk.to live chat widget.
 * This approach is more reliable for Next.js 15 hydration than a raw <Script> tag.
 */
export default function TawkMessenger() {
  useEffect(() => {
    // Only run on the client
    if (typeof window === 'undefined') return;

    // @ts-ignore - Tawk_API is global
    window.Tawk_API = window.Tawk_API || {};
    // @ts-ignore
    window.Tawk_LoadStart = new Date();

    const loadTawk = () => {
      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/6854ad05a39e6f190afdf00c/1iu5c7o0v';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      }
    };

    loadTawk();
  }, []);

  return null;
}
