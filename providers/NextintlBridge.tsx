"use client";

import { useI18n } from "@/contexts/i18n-context";
import { NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export function NextIntlBridge({ children }: Props) {
  const { locale } = useI18n();
  const [messages, setMessages] = useState<Record<string, unknown>>({});

  useEffect(() => {
    // Dynamically load messages for the active locale
    import(`@/messages/${locale}.json`)
      .then((mod) => setMessages(mod.default))
      .catch(() =>
        // Fallback to English if locale messages file doesn't exist
        import(`@/messages/en.json`).then((mod) => setMessages(mod.default))
      );
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}