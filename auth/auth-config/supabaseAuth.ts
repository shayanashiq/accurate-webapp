// auh/auth-config/supabaseAuth.ts 
 
import { createClient } from "@/lib/supabase/client"; 
// signup payload: { name, email, phone, password }
export async function signupSB(payload: any) {
  const supabase = await createClient()
  const { name, email, phone, password } = payload;
  const { data, error } = await supabase.auth.signUp({
    email, // you also signup with phone instaead of email, (check supabase api docs)
    password,
    options: {
      data: { name, phone },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin`,
    },
  });
  if (error) throw error;
  if (data?.user?.identities?.length === 0)
    throw new Error(
      'User with this email already exists, please login instead'
    );

  return data;
}

// signin payload can be { email,password } or adapt per your flow
export async function signinSB(payload: any) {
  const supabase = await createClient()
  const { email, password } = payload;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// signin with OTP
export async function signinWithMagicLinkSB(payload: any) {
  const supabase = await createClient()
  const { email } = payload;
  const { data, error } = await supabase.auth.signInWithOtp({ email }); // you also login with phone number (check supabase api docs)
  if (error) throw error;
  return data;
}

//  signin with google
export async function signinWithGoogleSB() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
}

// signin with facebook
export async function signinWithFacebookSB() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
}

 
// Supabase reset sends email link by default
export async function sendResetPasswordLinkSB(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });
  if (error) throw error;
  return true;
}

// resetPassword
export async function resetPasswordSB(tokenOrPayload: any, password?: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });
  if (error) throw error;
  //logout after password reset
  await supabase.auth.signOut();
  return data;
}

export async function logoutSB() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
}

// Supabase sends verification emails automatically on signUp (config dependent)
export async function verifyEmailSB(token: string) {
  const supabase = await createClient()
  // If you implement a custom verification, call your server endpoint
  return true;
}

export async function sendVerificationEmailSB(email: string) {
  const supabase = await createClient()
  // Supabase sends verification emails automatically on signUp (config dependent)
  return true;
}

export async function verifyOTPSB(payload: any) {
  const supabase = await createClient()
  const { email, token } = payload;
  let { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery',
  });
  if (error) throw error;
  return data;
}
