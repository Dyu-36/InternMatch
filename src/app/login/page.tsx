import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import LoginForm from './login-form';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await cookies()).get('internmatch_locale')?.value === 'en' ? 'en' : 'vi';
  return locale === 'en'
    ? {
        title: 'Sign in',
        description: 'Sign in to InternMatch to manage your profile and career opportunities.',
      }
    : {
        title: 'Đăng nhập',
        description: 'Đăng nhập vào InternMatch để quản lý hồ sơ và cơ hội nghề nghiệp của bạn.',
      };
}

export default function LoginPage() {
  return <LoginForm />;
}
