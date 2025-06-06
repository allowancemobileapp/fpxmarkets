
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getRequestConfig } from 'next-intl/server'; // Corrected import
import { Geist, Geist_Mono } from 'next/font/google'; // Assuming Geist is preferred
import '../globals.css'; // Adjusted path to globals.css
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
// import LiveChatButton from '@/components/LiveChatButton'; // Removed custom chat button
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import Script from 'next/script'; // Import next/script

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

// Define generateStaticParams if not already defined for i18n
// export async function generateStaticParams() {
//   const { locales } = await getRequestConfig();
//   return locales.map((locale) => ({ locale }));
// }


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
  params, // Access params directly
}: LocaleLayoutProps) {
  const locale = params.locale; // Get locale from params
  let messages;
  try {
    messages = await getMessages(locale);
  } catch (error) {
    console.error("Failed to load messages for locale:", locale, error);
    // Fallback to English messages or handle error appropriately
    // For simplicity, this might lead to an error page if messages are critical
    // messages = await getMessages('en'); // Example fallback
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
                {/* <LiveChatButton /> Removed custom chat button */}
                <Toaster />
              </ThemeProvider>
            </NextIntlClientProvider>
          </AuthProvider>
        </Suspense>
        {/* Smartsupp Live Chat script */}
        <Script id="smartsupp-config" strategy="lazyOnload">
          {`
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = '96b3f10540afb961aa0ed8d42c1fd52dedc26a9a';
          `}
        </Script>
        <Script id="smartsupp-loader" strategy="lazyOnload">
          {`
            (function(d) {
              var s,c,o=window.smartsupp=function(){ o._.push(arguments)};o._=[];
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
