'use client';

import { useT } from '@/context/LocaleContext';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { KeyRound, LogIn } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button, Container, Input } from '@/components/ui';

export default function LoginPage() {
  const t = useT();
  const router = useRouter();
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      const success = await login(username, password);
      if (!success) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng.');
        return;
      }
      const next = new URLSearchParams(window.location.search).get('next');
      router.push(next?.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? next : '/');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Không thể đăng nhập. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <Container>
        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-card__icon auth-card__icon--blue"><LogIn size={28} aria-hidden="true" /></div>
          <div className="auth-card__header">
            <h1 id="login-title" className="auth-card__title">{t("Đăng nhập")}</h1>
            <p className="auth-card__description">{t("Chào mừng bạn quay trở lại với nền tảng InternMatch")}</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <Input label={t("Tên đăng nhập")} name="username" autoComplete="username" placeholder={t("Nhập tên đăng nhập")} value={username} onChange={(event) => setUsername(event.target.value)} required />
            <Input label={t("Mật khẩu")} name="password" type="password" autoComplete="current-password" placeholder={t("Nhập mật khẩu")} value={password} onChange={(event) => setPassword(event.target.value)} required />
            {error ? <p className="ui-error" role="alert">{t(error)}</p> : null}
            <Button type="submit" size="lg" fullWidth loading={loading} loadingLabel={t("Đang đăng nhập…")}><KeyRound size={18} aria-hidden="true" /> {t("Đăng nhập")}</Button>
          </form>
          <div className="auth-card__footer">{t("Chưa có tài khoản?")} <Link href="/register">{t("Đăng ký ngay")}</Link></div>
        </section>
      </Container>
    </main>
  );
}
