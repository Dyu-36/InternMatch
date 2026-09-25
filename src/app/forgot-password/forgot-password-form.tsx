'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { KeyRound, Loader2, MailCheck } from 'lucide-react';
import { requestPasswordReset } from '@/app/actions';
import { useLocale, useT } from '@/context/LocaleContext';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Container } from '@/components/ui';

export default function ForgotPasswordForm() {
  const t = useT();
  const { locale } = useLocale();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t('Vui lòng nhập email hợp lệ.'));
      return;
    }

    setLoading(true);
    try {
      const response = await requestPasswordReset({ email });
      if (response.error) {
        setError(response.error);
        return;
      }
      setSent(true);
    } catch {
      setError(t('Không thể gửi yêu cầu. Vui lòng thử lại.'));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <Container>
          <section className="auth-card" aria-labelledby="forgot-password-title">
            <div className="auth-card__icon auth-card__icon--green"><MailCheck size={28} aria-hidden="true" /></div>
            <div className="auth-card__header">
              <h1 id="forgot-password-title" className="auth-card__title">{locale === 'en' ? t('Auth.resetSent') : 'Đã gửi liên kết đặt lại mật khẩu'}</h1>
              <p className="auth-card__description">{locale === 'en' ? t('Auth.resetSentDescription') : 'Vui lòng kiểm tra hộp thư để tiếp tục đặt lại mật khẩu.'}</p>
            </div>
            <div className="auth-card__footer">
              <Link href="/login">{locale === 'en' ? t('Auth.backToLogin') : 'Quay lại đăng nhập'}</Link>
            </div>
          </section>
        </Container>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <Container>
        <section className="auth-card" aria-labelledby="forgot-password-title">
          <div className="auth-card__icon auth-card__icon--blue"><KeyRound size={28} aria-hidden="true" /></div>
          <div className="auth-card__header">
            <h1 id="forgot-password-title" className="auth-card__title">{locale === 'en' ? t('Auth.forgotPasswordTitle') : 'Quên mật khẩu'}</h1>
            <p className="auth-card__description">{locale === 'en' ? t('Auth.forgotPasswordDescription') : 'Nhập email để chúng tôi gửi liên kết đặt lại mật khẩu.'}</p>
          </div>
          <form className="auth-form grid gap-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-2">
              <Label htmlFor="reset-email">{locale === 'en' ? t('Auth.resetEmail') : 'Email đã đăng ký'}</Label>
              <Input
                id="reset-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={t('Nhập email')}
                value={email}
                onChange={(event) => { setEmail(event.target.value); setError(''); }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'reset-email-error' : undefined}
                required
              />
              {error ? <p id="reset-email-error" className="text-sm text-destructive" role="alert">{error}</p> : null}
            </div>
            <Button type="submit" size="lg" className="h-12 w-full" disabled={loading}>
              {loading ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t('Đang gửi…')}</> : locale === 'en' ? t('Auth.resetSend') : 'Gửi liên kết đặt lại'}
            </Button>
          </form>
          <div className="auth-card__footer">
            <Link href="/login">{locale === 'en' ? t('Auth.backToLogin') : 'Quay lại đăng nhập'}</Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
