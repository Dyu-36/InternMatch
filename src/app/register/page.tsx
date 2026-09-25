import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import RegisterForm from './register-form';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await cookies()).get('internmatch_locale')?.value === 'en' ? 'en' : 'vi';
  return locale === 'en'
    ? {
        title: 'Create an account',
        description: 'Create an InternMatch account to start your internship journey.',
      }
    : {
        title: 'Tạo tài khoản',
        description: 'Tạo tài khoản InternMatch để bắt đầu hành trình thực tập của bạn.',
      };
}

export default function RegisterPage() {
  return <RegisterForm />;
}
