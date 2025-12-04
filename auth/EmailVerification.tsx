// auth/VerifyEmail.tsx
'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { verifyEmailSB, verifyOTPSB } from './auth-config/supabaseAuth';

export default function EmailVerification() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params?.get('token');

  React.useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        // try verify via dedicated method name, prefer verifyEmail then verifyOTP
        if (verifyEmailSB) {
          await verifyEmailSB(token);
        } else {
          await verifyOTPSB({ token });
        }
        toast.success('Email verified successfully.');
        router.push('/auth/signin');
      } catch (err: any) {
        toast.error(err?.message || 'Verification failed.');
      }
    })();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="p-6 bg-white rounded-md shadow">
        {' '}
        Verifying your email — please wait...
      </div>
    </div>
  );
}
