import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { ResetPasswordForm } from './reset-password-form';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await cookies()).get('internmatch_locale')?.value === 'en' ? 'en' : 'vi';
  return locale === 'en'
    ? {
        title: 'Reset password',
        description: 'Reset your InternMatch account password.',
      }
    : {
        title: 'Đặt lại mật khẩu',
        description: 'Đặt lại mật khẩu tài khoản InternMatch của bạn.',
      };
}

export default async function ResetPasswordPage() {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  return <ResetPasswordForm authenticated={Boolean(user)} />;
}
