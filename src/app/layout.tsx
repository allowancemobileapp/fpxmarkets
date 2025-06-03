
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import LiveChatButton from '@/components/LiveChatButton'; // Import the LiveChatButton
import { Suspense } from 'react'; // Import Suspense
import { Loader2 } from 'lucide-react'; // Import a loader for fallback

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

const AuthLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
    <p className="ml-3 text-muted-foreground">Loading session...</p>
  </div>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Suspense fallback={<AuthLoader />}>
          <AuthProvider>
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
              <LiveChatButton /> {/* Add LiveChatButton here */}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
