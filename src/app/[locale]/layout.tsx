
// This layout now correctly nests within the RootLayout
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { ReactNode } from 'react';

interface LocaleLayoutProps {
  children: ReactNode;
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
        messages = {}; // Provide empty messages as a last resort
    }
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
