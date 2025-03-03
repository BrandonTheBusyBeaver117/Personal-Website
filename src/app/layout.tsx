import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Image from 'next/image';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Beaver Dam',
  description: 'A personal-ish website for Brandon Nguyen to showcase interesting projects',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <div className="fixed left-0 top-0 -z-10 min-h-[100vw] min-w-[150vw] bg-fixed">
          <Image src="/background-aurora.png" alt="" fill={true}></Image>
        </div>
        <header className="flex h-[12.5vh] items-center justify-center">
          <Link href="/">
            <div className="title text-6xl font-semibold transition">The Beaver Dam</div>
          </Link>
        </header>

        <main className="flex h-[80vh] flex-col items-center justify-evenly">{children}</main>

        <footer className="flex h-[7.5vh] items-center justify-center">
          <div>Brandon Nguyen's Personal Website</div>
        </footer>
      </body>
    </html>
  );
}
