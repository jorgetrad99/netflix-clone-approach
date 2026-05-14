import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Netflix Docs Viewer',
    template: '%s · Netflix Docs Viewer',
  },
  description:
    'Plan maestro del Netflix Clone, presentado con la estética y los patrones de navegación de Netflix.',
  applicationName: 'Netflix Docs Viewer',
  openGraph: {
    type: 'website',
    siteName: 'Netflix Docs Viewer',
    title: 'Netflix Docs Viewer',
    description:
      'Plan maestro del Netflix Clone, presentado con la estética y los patrones de navegación de Netflix.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
