'use client';

import client from '@/client';
import './globals.css';
import { Inter } from 'next/font/google';
import { Provider } from 'urql';
import { Toaster } from 'react-hot-toast';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import { Header } from '@/view/layout/header';
import { Footer } from '@/view/layout/footer';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* React Hot Toast */}
        <Toaster position="top-center" />
        
        {/* Shadcn Toast for new notifications */}
        <ShadcnToaster />

        <ReactQueryProvider>
          <Provider value={client}>
            <Header />
            {children}
            <Footer />
          </Provider>
        </ReactQueryProvider>

        {/* Midtrans Snap - Load at end of body */}
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