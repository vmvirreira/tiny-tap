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
          href="/audio/peekaboo.wav"
          as="audio"
          type="audio/wav"
        />
        <link
          rel="preload"
          href="/audio/star.wav"
          as="audio"
          type="audio/wav"
        />
        {[262, 330, 392, 523, 659].map((note) => (
          <link
            key={note}
            rel="preload"
            href={`/audio/note-${note}.wav`}
            as="audio"
            type="audio/wav"
          />
        ))}
      </head>
      <body className={`${heading.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
