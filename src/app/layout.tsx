import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";
import { readAppState } from '@/lib/repository';
import { LocaleProvider } from '@/context/LocaleContext';
import { cookies } from 'next/headers';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "InternMatch",
    template: "%s | InternMatch",
  },
  description: "Nền tảng kết nối sinh viên và doanh nghiệp tuyển dụng thực tập.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialState = await readAppState();
  const locale = (await cookies()).get('internmatch_locale')?.value === 'en' ? 'en' : 'vi';
  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable}`}>
      <body>
        <LocaleProvider initialLocale={locale}><AppProvider initialState={initialState}>
          <SiteHeader />
          <main className="min-h-screen">{children}</main>
          <SiteFooter />
        </AppProvider></LocaleProvider>
      </body>
    </html>
  );
}
