// auth/VerifyOtp.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpVerificationSchema } from '@/auth/authSchemas';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import toast from 'react-hot-toast';
import { z } from 'zod';
import Maxwidth from '@/components/Maxwidth';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { verifyOTPSB } from './auth-config/supabaseAuth';

type OTPValues = z.infer<typeof otpVerificationSchema>;

export default function OtpVerification() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OTPValues>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = async (values: OTPValues) => {
    setIsLoading(true);
    try {
      await verifyOTPSB(values);
      toast.success('Verified successfully.');
      // navigate after verification
    } catch (err: any) {
      toast.error(err?.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh   items-center justify-center">
      <Maxwidth className="max-w-md py-8">
        <Card>
          <CardHeader>
            <CardTitle>OTP Verification</CardTitle>
            <CardDescription>
              Enter the OTP sent to your email to verify your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter OTP</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      {/* <FormDescription>
                        Please enter the one-time password sent to your phone.
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full " disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Maxwidth>
    </div>
  );
}
