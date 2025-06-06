
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
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import Script from 'next/script'; // Import Script

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

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = params.locale;
  let messages;
  try {
    messages = await getMessages(locale);
    console.log(`[LocaleLayout] Successfully loaded messages for locale: ${locale}`);
  } catch (error) {
    console.error(`[LocaleLayout] Failed to load messages for locale: ${locale}. Error:`, error);
    try {
        console.warn(`[LocaleLayout] Attempting to fallback to 'en' messages for locale: ${locale}`);
        messages = await getMessages('en');
    } catch (fallbackError) {
        console.error(`[LocaleLayout] CRITICAL: Failed to load fallback 'en' messages. Error:`, fallbackError);
        messages = {}; 
    }
  }

  return (
    <html lang={locale} suppressHydrationWarning>
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
        
        {/* Smartsupp Live Chat script - Standard Loader */}
        <Script id="smartsupp-loader" strategy="lazyOnload">
          {`
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = '96b3f10540afb961aa0ed8d42c1fd52dedc26a9a';
            window.smartsupp||(function(d) {
              var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
              s=d.getElementsByTagName('script')[0];c=d.createElement('script');
              c.type='text/javascript';c.charset='utf-8';c.async=true;
              c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
            })(document);
          `}
        </Script>
        <noscript>
          Powered by <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">Smartsupp</a>
        </noscript>
      </body>
    </html>
  );
}
