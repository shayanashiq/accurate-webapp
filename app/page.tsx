// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/auth-config/useAuth';

export default function Home() {
  const router = useRouter();
  const { logout, loadingLogout } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-neutral-900 dark:to-neutral-800 transition-colors duration-300">
      {/* Logo Section */}
      <div className="flex flex-col items-center text-center space-y-4 mb-10">
        <Image
          src="/next.svg"
          alt="Next.js Logo"
          width={120}
          height={30}
          className="dark:invert"
          priority
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
          Welcome to Your Next.js Starter
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Build your next project faster — optional auth (Supabase or GraphQL)
          included and ready to use.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <Button
          size="lg"
          className="px-6"
          onClick={() => router.push('/auth/signin')}
        >
          Login
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="px-6"
          onClick={() => router.push('/auth/signup')}
        >
          Sign Up
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="px-6"
          disabled={loadingLogout}
          onClick={() => logout()}
        >
          Logout
        </Button>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-500 dark:text-gray-400 text-center">
        Built with ❤️ using{' '}
        <a
          href="https://nextjs.org"
          className="text-blue-600 dark:text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.js
        </a>{' '}
        and{' '}
        <a
          href="https://ui.shadcn.com/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          ShadCN UI
        </a>
      </footer>
    </main>
  );
}
