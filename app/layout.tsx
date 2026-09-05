import type { Metadata, Viewport } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';

const heading = Fredoka({ variable: '--font-heading', subsets: ['latin'] });
const body = Nunito({ variable: '--font-body', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tiny Tap — Little games for growing minds',
  description:
    'Ten gentle, playful mini-games for babies and toddlers from 6 months to 2+ years.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#fff8e7',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/audio/cow-real.mp3"
          as="audio"
          type="audio/mpeg"
        />
        <link
          rel="preload"
          href="/audio/sheep-real.mp3"
          as="audio"
          type="audio/mpeg"
        />
        <link
          rel="preload"
          href="/audio/duck-real.mp3"
          as="audio"
          type="audio/mpeg"
        />
        <link
          rel="preload"
          href="/audio/pig-real.mp3"
          as="audio"
          type="audio/mpeg"
        />
        <link
          rel="preload"
          href="/audio/cat-real.mp3"
          as="audio"
          type="audio/mpeg"
        />
        <link
          rel="preload"
          href="/audio/dog-real.mp3"
          as="audio"
          type="audio/mpeg"
        />
        <link
          rel="preload"
          href="/audio/horse-real.mp3"
          as="audio"
          type="audio/mpeg"
        />
        <link
          rel="preload"
          href="/audio/rooster-real.mp3"
          as="audio"
          type="audio/mpeg"
        />
        <link
          rel="preload"
          href="/audio/peekaboo-wikimedia.wav"
          as="audio"
          type="audio/wav"
        />
        <link
          rel="preload"
          href="/audio/piano-c4.flac"
          as="audio"
          type="audio/flac"
        />
        <link
          rel="preload"
          href="/audio/drum-real.wav"
          as="audio"
          type="audio/wav"
        />
        <link
          rel="preload"
          href="/audio/clap-real.wav"
          as="audio"
          type="audio/wav"
        />
      </head>
      <body className={`${heading.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
