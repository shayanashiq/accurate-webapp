// app/layout.tsx
'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { Header } from '@/view/layout/header';
import { Footer } from '@/view/layout/footer';
import Script from 'next/script';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-center" />
        <ShadcnToaster />

        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>

        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
          onLoad={() => {
            console.log('✅ Midtrans Snap loaded successfully');
          }}
        />
      </body>
    </html>
  );
}