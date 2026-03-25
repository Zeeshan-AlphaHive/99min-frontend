import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/store/auth-context";
import SilentRefreshInit from "@/components/auth/SilentRefresh";
import QueryProvider from "@/providers/QueryProvider";
import { NextIntlClientProvider } from "next-intl";
import { I18nProvider } from "@/contexts/i18n-context";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "99min",
  description: "99min is a platform for finding and posting tasks",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider>
          <I18nProvider>
            <QueryProvider>
              <AuthProvider>
                <SilentRefreshInit>
                  {children}
                </SilentRefreshInit>
              </AuthProvider>
            </QueryProvider>
          </I18nProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}