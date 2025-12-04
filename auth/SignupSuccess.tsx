// auth/SignupSuccess.tsx

import Link from 'next/link';
import Maxwidth from '@/components/Maxwidth';
import { CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SignupSuccess() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Maxwidth className="max-w-md py-8">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-semibold">
              Account Created Successfully!
            </CardTitle>
            <CardDescription>
              We&apos;ve sent a confirmation email to your inbox. Please verify
              your email to complete the signup process.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Once verified, you can log in to access your dashboard and start
              using your account.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/auth/signin">Go to Login</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </Maxwidth>
    </div>
  );
}
