'use client';

import { useLocale, useT } from '@/context/LocaleContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { KeyRound, Loader2, LogIn } from 'lucide-react';
import { signIn } from '@/app/actions';
import { safeLoginPath } from '@/lib/auth';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Container } from '@/components/ui';

export default function LoginForm() {
  const t = useT();
  const { locale } = useLocale();
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const nextFieldErrors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) nextFieldErrors.identifier = 'Vui lòng nhập email hoặc username.';
    if (!password) nextFieldErrors.password = 'Vui lòng nhập mật khẩu.';
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }

    setLoading(true);
    try {
      const response = await signIn({ identifier, password });
      if (response.error || !response.data) {
        setError(response.error ?? 'Không thể đăng nhập. Vui lòng thử lại.');
        return;
      }
      const fallback = response.data === 'COMPANY' ? '/company/dashboard' : '/student/dashboard';
      const requestedPath = new URLSearchParams(window.location.search).get('next');
      router.replace(safeLoginPath(requestedPath, fallback));
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Không thể đăng nhập. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-card__icon auth-card__icon--blue"><LogIn size={28} aria-hidden="true" /></div>
          <div className="auth-card__header">
            <h1 id="login-title" className="auth-card__title">{t("Đăng nhập")}</h1>
            <p className="auth-card__description">{t("Chào mừng bạn quay trở lại với nền tảng InternMatch")}</p>
          </div>
          <form className="auth-form grid gap-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-2">
              <Label htmlFor="login-identifier">{t("Email hoặc username")}</Label>
              <Input
                id="login-identifier"
                name="identifier"
                autoComplete="username"
                placeholder={t("Nhập email hoặc username")}
                value={identifier}
                onChange={(event) => { setIdentifier(event.target.value); setFieldErrors((current) => ({ ...current, identifier: undefined })); setError(''); }}
                aria-invalid={Boolean(fieldErrors.identifier)}
                aria-describedby={fieldErrors.identifier ? 'login-identifier-error' : undefined}
                required
              />
              {fieldErrors.identifier ? <p id="login-identifier-error" className="text-sm text-destructive" role="alert">{t(fieldErrors.identifier)}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="login-password">{t("Mật khẩu")}</Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder={t("Nhập mật khẩu")}
                value={password}
                onChange={(event) => { setPassword(event.target.value); setFieldErrors((current) => ({ ...current, password: undefined })); setError(''); }}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                required
              />
              {fieldErrors.password ? <p id="login-password-error" className="text-sm text-destructive" role="alert">{t(fieldErrors.password)}</p> : null}
            </div>
            <div className="flex justify-end">
              <Link className="text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline" href="/forgot-password">
                {locale === 'en' ? t('Auth.forgotPassword') : 'Quên mật khẩu?'}
              </Link>
            </div>
            {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{t(error)}</p> : null}
            <Button type="submit" size="lg" className="h-12 w-full" disabled={loading}>
              {loading ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t("Đang đăng nhập…")}</> : <><KeyRound aria-hidden="true" /> {t("Đăng nhập")}</>}
            </Button>
          </form>
          <div className="auth-card__footer">{t("Chưa có tài khoản?")} <Link href="/register">{t("Đăng ký ngay")}</Link></div>
        </section>
      </Container>
    </div>
  );
}
