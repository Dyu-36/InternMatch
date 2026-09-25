'use client';

import { useT } from '@/context/LocaleContext';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { KeyRound, Loader2, LogIn } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Container } from '@/components/ui';

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
          <form className="auth-form grid gap-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-2">
              <Label htmlFor="login-username">{t("Tên đăng nhập")}</Label>
              <Input id="login-username" name="username" autoComplete="username" placeholder={t("Nhập tên đăng nhập")} value={username} onChange={(event) => setUsername(event.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="login-password">{t("Mật khẩu")}</Label>
              <Input id="login-password" name="password" type="password" autoComplete="current-password" placeholder={t("Nhập mật khẩu")} value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{t(error)}</p> : null}
            <Button type="submit" size="lg" className="h-12 w-full bg-emerald-600 text-white hover:bg-emerald-700" disabled={loading}>
              {loading ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t("Đang đăng nhập…")}</> : <><KeyRound aria-hidden="true" /> {t("Đăng nhập")}</>}
            </Button>
          </form>
          <div className="auth-card__footer">{t("Chưa có tài khoản?")} <Link href="/register">{t("Đăng ký ngay")}</Link></div>
        </section>
      </Container>
    </main>
  );
}
