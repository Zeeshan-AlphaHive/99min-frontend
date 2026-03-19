"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  EN_MESSAGES,
  getMessagesForLocale,
  type MessageKey,
} from "@/lib/ui-messages";

const STORAGE_KEY = "99min-ui-locale";
const TEXT_TRANSLATION_STORAGE_PREFIX = "99min-ui-text-translations";

type I18nContextValue = {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  /**
   * Translate an arbitrary UI string from English -> the active UI locale.
   * Returns the original string until the translation finishes (cached thereafter).
   */
  tr: (text: string) => string;
  languageLabel: (languageCode: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function safeDisplayNames(locale: string): Intl.DisplayNames {
  try {
    return new Intl.DisplayNames([locale], { type: "language" });
  } catch {
    return new Intl.DisplayNames(["en"], { type: "language" });
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState("en");
  const localeRef = useRef(locale);
  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  const [textTranslations, setTextTranslations] = useState<Record<string, string>>({});
  const pendingRef = useRef<Record<string, Promise<string> | undefined>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setLocaleState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    // Load per-locale translation cache for arbitrary UI strings.
    try {
      const raw = localStorage.getItem(`${TEXT_TRANSLATION_STORAGE_PREFIX}:${locale}`);
      if (!raw) {
        setTextTranslations({});
        return;
      }
      const parsed = JSON.parse(raw) as Record<string, string>;
      setTextTranslations(parsed ?? {});
    } catch {
      setTextTranslations({});
    }
  }, [locale]);

  const setLocale = useCallback((next: string) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      const messages = getMessagesForLocale(locale);
      let s = messages[key] ?? EN_MESSAGES[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.split(`{${k}}`).join(String(v));
        }
      }
      return s;
    },
    [locale],
  );

  const languageLabel = useCallback(
    (languageCode: string) => {
      const dn = safeDisplayNames(locale);
      try {
        return dn.of(languageCode) ?? languageCode;
      } catch {
        return languageCode;
      }
    },
    [locale],
  );

  const ensureTextTranslation = useCallback(
    (text: string, nextLocale: string) => {
      const pendingKey = `${nextLocale}::${text}`;
      if (pendingRef.current[pendingKey]) return pendingRef.current[pendingKey];

      const p = (async () => {
        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, to: nextLocale }),
          });
          if (!res.ok) return text;
          const data = (await res.json()) as { translatedText?: string };
          return typeof data.translatedText === "string" ? data.translatedText : text;
        } catch {
          return text;
        }
      })();

      pendingRef.current[pendingKey] = p;

      p.then((translated) => {
        try {
          if (localeRef.current !== nextLocale) return;
          setTextTranslations((prev) => {
            if (prev[text]) return prev; // already cached
            const next = { ...prev, [text]: translated };
            try {
              localStorage.setItem(
                `${TEXT_TRANSLATION_STORAGE_PREFIX}:${nextLocale}`,
                JSON.stringify(next),
              );
            } catch {
              /* ignore */
            }
            return next;
          });
        } finally {
          delete pendingRef.current[pendingKey];
        }
      }).catch(() => {
        delete pendingRef.current[pendingKey];
      });

      return p;
    },
    [],
  );

  const tr = useCallback(
    (text: string) => {
      if (!text) return text;
      if (locale === "en") return text;

      const cached = textTranslations[text];
      if (cached) return cached;

      // Best-effort: kick off translation, but keep UI responsive.
      ensureTextTranslation(text, locale);
      return text;
    },
    [ensureTextTranslation, locale, textTranslations],
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t, tr, languageLabel }),
    [locale, setLocale, t, tr, languageLabel],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
