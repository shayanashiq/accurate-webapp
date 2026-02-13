'use client';

import client from '@/client';
import './globals.css';
import { Inter } from 'next/font/google';
import { Provider } from 'urql';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Toaster } from 'react-hot-toast';
import SetContext from '@/components/Elements/SetContext';
import { AppContext, IAppContext, IUser } from '@/utils/context';
import { ReactQueryProvider } from '@/components/ReactQueryProvider';
import { Header } from '@/view/layout/header';
import { Footer } from '@/view/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useEffect(() => {
  //   const token = Cookies.get('token');
  //   if (!token) {
  //     fetch('/api/token').then((data) => {
  //       data.json().then((d) => {
  //         Cookies.set('token', d.token);
  //         window.location.reload();
  //       });
  //     });
  //   }
  // }, []);

  // const [context, setContext] = useState<any>({ fetching: true });

  // const setFetching = (fetching: boolean) => {
  //   (context as any).fetching = fetching;
  //   setContext({ ...context });
  // };

  // const setUser = (user: IUser) => {
  //   setContext({ ...context, user });
  // };

  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        {/* <SessionProvider> */}
        {/* <AppContext.Provider value={{ context, setUser, setFetching }}> */}
        <ReactQueryProvider>
          <Provider value={client}>
            {/* <SetContext /> */}
            <Header />
            {children}
            <Footer />
          </Provider>
        </ReactQueryProvider>
        {/* </AppContext.Provider> */}
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
