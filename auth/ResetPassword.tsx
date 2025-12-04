// auth/ResetPassword.tsx
'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@/auth/authSchemas';
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
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { z } from 'zod';
import Maxwidth from '@/components/Maxwidth';
import { Eye, EyeOff } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from './auth-config/useAuth';

type ResetValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const params = useSearchParams();
  const router = useRouter();
  const { resetPassword, loadingResetPassword } = useAuth();
  const token = params?.get('token') ?? undefined;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ResetValues) => {
    await resetPassword(token ?? '', values.password);
  };

  return (
    <div className="flex min-h-svh   items-center justify-center">
      <Maxwidth className="max-w-md py-8">
        <Card>
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>Enter your new password below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword((s) => !s)}
                          >
                            {showPassword ? (
                              <EyeOff className="text-gray-500 cursor-pointer w-4 h-4" />
                            ) : (
                              <Eye className="text-gray-500 cursor-pointer w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword((s) => !s)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="text-gray-500 cursor-pointer w-4 h-4" />
                            ) : (
                              <Eye className="text-gray-500 cursor-pointer w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loadingResetPassword}
                >
                  {loadingResetPassword ? (
                    <>
                      {' '}
                      <Spinner /> Resetting...{' '}
                    </>
                  ) : (
                    'Reset password'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Maxwidth>
    </div>
  );
}
