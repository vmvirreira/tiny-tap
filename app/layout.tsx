import type { Metadata, Viewport } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';

const heading = Fredoka({ variable: '--font-heading', subsets: ['latin'] });
const body = Nunito({ variable: '--font-body', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tiny Tap — Little games for growing minds',
  description: 'Ten gentle, playful mini-games for babies and toddlers from 6 months to 2+ years.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#fff8e7' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${heading.variable} ${body.variable}`}>{children}</body></html>;
}
