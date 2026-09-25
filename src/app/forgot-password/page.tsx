import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import ForgotPasswordForm from './forgot-password-form';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await cookies()).get('internmatch_locale')?.value === 'en' ? 'en' : 'vi';
  return locale === 'en'
    ? {
        title: 'Forgot password',
        description: 'Request a password reset link for your InternMatch account.',
      }
    : {
        title: 'Quên mật khẩu',
        description: 'Gửi liên kết đặt lại mật khẩu cho tài khoản InternMatch của bạn.',
      };
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
