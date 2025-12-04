// auth/auth-config/useAuth.ts

import { useRouter } from 'next/navigation';
import { useMutation } from 'urql';
import {
  RESET_PASSWORD,
  SEND_RESET_PASSWORD_LINK,
  SIGNIN,
  SIGNUP,
} from './graphqlAuth';
import { AUTH_PROVIDER } from './authProvider';
import toast from 'react-hot-toast';
import { useState } from 'react';
import {
  logoutSB,
  resetPasswordSB,
  sendResetPasswordLinkSB,
  signinSB,
  signinWithFacebookSB,
  signinWithGoogleSB,
  signupSB,
} from './supabaseAuth';
import Cookies from 'js-cookie';

export function useAuth() {
  const router = useRouter();
  const [loadingType, setLoadingType] = useState<
    'signup' | 'signin' | 'forgotPassword' | 'resetPassword' | 'logout' | 'signinWithGoogle' | 'signinWithFacebook' | null
  >(null);

  const [{ fetching: fetchingSignup }, signupGQL] = useMutation(SIGNUP);
  const [{ fetching: fetchingSignin }, signinGQL] = useMutation(SIGNIN);
  const [
    { fetching: fetchingSendResetPasswordLink },
    sendResetPasswordLinkGQL,
  ] = useMutation(SEND_RESET_PASSWORD_LINK);
  const [{ fetching: fetchingResetPassword }, resetPasswordGQL] =
    useMutation(RESET_PASSWORD);

  function handleSuccess(message: string, redirectTo?: string) {
    toast.success(message);
    if (redirectTo) router.push(redirectTo);
  }

  // signup function
  const signup = async (values: any) => {
    try {
      setLoadingType('signup');
      if (AUTH_PROVIDER === 'graphql') {
        const result = await signupGQL(values);
        if (result.error) throw result.error;
      } else if (AUTH_PROVIDER === 'supabase') {
        await signupSB(values);
      }
      handleSuccess(
        'Account created successfully! Please check your email for confirmation.',
        '/auth/signup-success'
      );
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong during signup.');
    } finally {
      setLoadingType(null);
    }
  };

  // signin function
  const signin = async (values: any) => {
    try {
      setLoadingType('signin');
      if (AUTH_PROVIDER === 'graphql') {
        const result = await signinGQL(values);
        if (result.error) throw result.error;
      } else if (AUTH_PROVIDER === 'supabase') {
        await signinSB(values);
      }
      handleSuccess('Logged in successfully.', '/');
    } catch (err: any) {
      toast.error(err?.message || 'Login failed. Check credentials.');
    } finally {
      setLoadingType(null);
    }
  };

  // forgot password
  const forgotPassword = async (values: any) => {
    try {
      setLoadingType('forgotPassword');
      if (AUTH_PROVIDER === 'graphql') {
        const result = await sendResetPasswordLinkGQL(values);
        if (result.error) throw result.error;
        handleSuccess(
          'Reset instructions sent to your email (if account exists).',
          '/auth/reset-password'
        );
      } else if (AUTH_PROVIDER === 'supabase') {
        await sendResetPasswordLinkSB(values);
        handleSuccess(
          'Reset instructions sent to your email (if account exists).'
        );
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send reset email.');
    } finally {
      setLoadingType(null);
    }
  };

  // reset password
  const resetPassword = async (tokenOrPayload: any, password?: string) => {
    try {
      setLoadingType('resetPassword');
      if (AUTH_PROVIDER === 'graphql') {
        await resetPasswordGQL({ token: tokenOrPayload, password });
      } else if (AUTH_PROVIDER === 'supabase') {
        await resetPasswordSB(tokenOrPayload, password);
      }
      handleSuccess(
        'Password reset successfully. Please sign in.',
        '/auth/signin'
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reset password.');
    } finally {
      setLoadingType(null);
    }
  };

  // logout
  const logout = async () => {
    try {
      setLoadingType('logout');
      if (AUTH_PROVIDER === 'graphql') {
        await Cookies.remove('token');
      } else if (AUTH_PROVIDER === 'supabase') {
        await logoutSB();
      }
      handleSuccess('Logged out successfully.', '/auth/signin');
    } catch (err: any) {
      toast.error(err?.message || 'Logout failed.');
    } finally {
      setLoadingType(null);
    }
  };

  const signinWithGoogle = async () => {
    try {
      setLoadingType('signin');
      await signinWithGoogleSB();
    } catch (err: any) {
      toast.error(err?.message || 'Google Login Failed');
    } finally {
      setLoadingType(null);
    }
  };

  const signinWithFacebook = async () => {
    try {
      setLoadingType('signin');
      await signinWithFacebookSB();
    } catch (err: any) {
      toast.error(err?.message || 'Facebook Login Failed');
    } finally {
      setLoadingType(null);
    }
  };

  let loadingSignup = fetchingSignup || loadingType === 'signup';
  let loadingSignin = fetchingSignin || loadingType === 'signin';
  let loadingSigninWithFacebook = loadingType === 'signinWithFacebook';
  let loadingSigninWithGoogle = loadingType === 'signinWithGoogle';
  let loadingForgotPassword =
    fetchingSendResetPasswordLink || loadingType === 'forgotPassword';
  let loadingResetPassword =
    fetchingResetPassword || loadingType === 'resetPassword';
  let loadingLogout = loadingType === 'logout';

  return {
    signup,
    loadingSignup,
    signin,
    loadingSignin,
    signinWithGoogle,
    loadingSigninWithGoogle,
    signinWithFacebook,
    loadingSigninWithFacebook,
    forgotPassword,
    loadingForgotPassword,
    resetPassword,
    loadingResetPassword,
    logout,
    loadingLogout,
  };
}
