
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Suspense, useEffect } from 'react'; // Added useEffect
import { Loader2 } from 'lucide-react';
// Removed direct Script import from next/script as we are using useEffect for Tawk.to

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FPX Markets - Online Trading Platform',
  description: 'Your premier destination for online trading. Forex, Shares, Commodities, and more.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

const AuthLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
    <p className="ml-3 text-muted-foreground">Loading session...</p>
  </div>
);

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = params.locale;
  let messages;
  try {
    messages = getMessages(locale);
  } catch (error) {
    console.error(`[LocaleLayout] Failed to load messages for locale: ${locale}. Error:`, error);
    try {
        messages = getMessages('en');
    } catch (fallbackError) {
        console.error(`[LocaleLayout] CRITICAL: Failed to load fallback 'en' messages. Error:`, fallbackError);
        messages = {};
    }
  }

  useEffect(() => {
    // Prevent loading multiple times
    if (document.getElementById("tawk-script")) {
      console.log('[FPX Markets - Tawk.to] Tawk.to script already present.');
      return;
    }

    console.log('[FPX Markets - Tawk.to] Dynamically adding Tawk.to script...');
    const script = document.createElement("script");
    script.id = "tawk-script";
    script.src = "https://embed.tawk.to/6854ad05a39e6f190afdf00c/1iu5c7o0v"; // Your widget ID
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    
    script.onload = () => {
      console.log('[FPX Markets - Tawk.to] Tawk.to script loaded successfully via dynamic append.');
    };
    script.onerror = () => {
      console.error('[FPX Markets - Tawk.to] Failed to load Tawk.to script via dynamic append.');
    };

    document.body.appendChild(script);

    // Optional: Clean up the script when the component unmounts,
    // though for a chat widget, you usually want it to persist.
    // return () => {
    //   const existingScript = document.getElementById("tawk-script");
    //   if (existingScript) {
    //     document.body.removeChild(existingScript);
    //   }
    // };
  }, []);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Any other head scripts/tags would go here */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Suspense fallback={<AuthLoader />}>
          <AuthProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
                <Toaster />
              </ThemeProvider>
            </NextIntlClientProvider>
          </AuthProvider>
        </Suspense>
        
        {/* Tawk.to script is now loaded via useEffect */}
        {/* NoScript part for Tawk.to - this can remain as it's for browsers with JS disabled */}
        <noscript>
          <a href="https://www.tawk.to/chat/6854ad05a39e6f190afdf00c/1iu5c7o0v" target="_blank" rel="noopener noreferrer">
            Live Chat by Tawk.to
          </a>
        </noscript>
      </body>
    </html>
  );
}
