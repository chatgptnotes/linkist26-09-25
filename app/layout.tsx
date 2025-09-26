import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GDPRConsentBanner from '@/components/gdpr-consent-banner';
import { ToastProvider } from '@/components/ToastProvider';
import AdminInitializer from '@/components/AdminInitializer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Linkist NFC - Smart Business Cards",
  description: "Create premium NFC business cards with instant contact sharing. Tap to connect.",
  keywords: "NFC, business cards, smart cards, digital business card, contactless",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/apple-touch-icon.png',
    android: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Linkist NFC - Smart Business Cards",
    description: "Create premium NFC business cards with instant contact sharing",
    url: "https://linkist.ai/nfc",
    siteName: "Linkist",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <AdminInitializer />
        <ToastProvider>
          {children}
          <GDPRConsentBanner />
        </ToastProvider>
      </body>
    </html>
  );
}
