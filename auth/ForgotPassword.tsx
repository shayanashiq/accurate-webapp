// auth/ForgetPassword.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/auth/authSchemas';
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import Maxwidth from '@/components/Maxwidth';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { useAuth } from './auth-config/useAuth';

type ForgotValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const { forgotPassword, loadingForgotPassword } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotValues) => {
    await forgotPassword(values.email);
    setIsSuccess(true); // ✅ show success message
    setSubmittedEmail(values.email); // ✅ save email for message
    form.reset();
  };

  return (
    <div className="flex min-h-svh   items-center justify-center">
      <Maxwidth className="max-w-md py-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {isSuccess ? 'Check Your Email' : 'Forgot Password'}
            </CardTitle>
            <CardDescription>
              {isSuccess
                ? `We have sent a password reset link to ${submittedEmail}.`
                : 'Enter your email to receive a link to reset your password'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSuccess && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loadingForgotPassword}
                  >
                    {loadingForgotPassword ? (
                      <>
                        {' '}
                        <Spinner /> Sending...{' '}
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {!isSuccess && (
              <p className="text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link
                  href="/auth/signin"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </Maxwidth>
    </div>
  );
}
