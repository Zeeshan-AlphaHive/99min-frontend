"use client";

import { useI18n } from "@/contexts/i18n-context";
import { NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";
import deMessages from "@/messages/de.json";
import enMessages from "@/messages/en.json";

interface Props {
  children: React.ReactNode;
}

export function NextIntlBridge({ children }: Props) {
  const { locale } = useI18n();
  const [messages, setMessages] = useState<Record<string, unknown>>(deMessages);

  useEffect(() => {
    // Dynamically load messages for the active locale
    import(`@/messages/${locale}.json`)
      .then((mod) => setMessages(mod.default))
      .catch(() =>
        // Fallback to German (then English) if locale messages file doesn't exist
        setMessages((deMessages as unknown as Record<string, unknown>) || (enMessages as unknown as Record<string, unknown>))
      );
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}