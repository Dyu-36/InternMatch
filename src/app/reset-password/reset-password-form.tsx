'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { updatePassword } from '@/app/actions';
import { useLocale, useT } from '@/context/LocaleContext';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Container } from '@/components/ui';

export function ResetPasswordForm({ authenticated }: { authenticated: boolean }) {
  const t = useT();
  const { locale } = useLocale();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [error, setError] = useState('');
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const nextFieldErrors: { password?: string; confirmPassword?: string } = {};
    if (password.length < 8) nextFieldErrors.password = t('Mật khẩu cần có ít nhất 8 ký tự.');
    if (!confirmPassword) nextFieldErrors.confirmPassword = t('Vui lòng nhập lại mật khẩu.');
    if (password !== confirmPassword) nextFieldErrors.confirmPassword = t('Mật khẩu xác nhận chưa khớp.');
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await updatePassword({ password, confirmPassword });
      if (response.error) {
        setError(response.error);
        return;
      }
      setUpdated(true);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : t('Không thể cập nhật mật khẩu. Vui lòng thử lại.'));
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="auth-page">
        <Container>
          <section className="auth-card" aria-labelledby="reset-password-title">
            <div className="auth-card__icon auth-card__icon--blue"><KeyRound size={28} aria-hidden="true" /></div>
            <div className="auth-card__header">
              <h1 id="reset-password-title" className="auth-card__title">{locale === 'en' ? t('Auth.resetPasswordTitle') : 'Đặt lại mật khẩu'}</h1>
              <p className="auth-card__description">{t('Phiên đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.')}</p>
            </div>
            <div className="auth-card__footer"><Link href="/forgot-password">{locale === 'en' ? t('Auth.forgotPassword') : 'Yêu cầu liên kết mới'}</Link></div>
          </section>
        </Container>
      </div>
    );
  }

  if (updated) {
    return (
      <div className="auth-page">
        <Container>
          <section className="auth-card" aria-labelledby="reset-password-title">
            <div className="auth-card__icon auth-card__icon--green"><ShieldCheck size={28} aria-hidden="true" /></div>
            <div className="auth-card__header">
              <h1 id="reset-password-title" className="auth-card__title">{locale === 'en' ? t('Auth.passwordUpdated') : 'Mật khẩu đã được cập nhật'}</h1>
              <p className="auth-card__description">{locale === 'en' ? t('Auth.resetPasswordDescription') : 'Bạn có thể sử dụng mật khẩu mới để đăng nhập.'}</p>
            </div>
            <div className="auth-card__footer"><Link href="/login">{locale === 'en' ? t('Auth.backToLogin') : 'Quay lại đăng nhập'}</Link></div>
          </section>
        </Container>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <Container>
        <section className="auth-card" aria-labelledby="reset-password-title">
          <div className="auth-card__icon auth-card__icon--blue"><KeyRound size={28} aria-hidden="true" /></div>
          <div className="auth-card__header">
            <h1 id="reset-password-title" className="auth-card__title">{locale === 'en' ? t('Auth.resetPasswordTitle') : 'Tạo mật khẩu mới'}</h1>
            <p className="auth-card__description">{locale === 'en' ? t('Auth.resetPasswordDescription') : 'Nhập mật khẩu mới để tiếp tục.'}</p>
          </div>
          <form className="auth-form grid gap-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-2">
              <Label htmlFor="new-password">{locale === 'en' ? t('Auth.newPassword') : 'Mật khẩu mới'}</Label>
              <Input
                id="new-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => { setPassword(event.target.value); setFieldErrors((current) => ({ ...current, password: undefined })); setError(''); }}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'new-password-error' : undefined}
                required
              />
              {fieldErrors.password ? <p id="new-password-error" className="text-sm text-destructive" role="alert">{fieldErrors.password}</p> : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-new-password">{locale === 'en' ? t('Auth.confirmNewPassword') : 'Xác nhận mật khẩu mới'}</Label>
              <Input
                id="confirm-new-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(event) => { setConfirmPassword(event.target.value); setFieldErrors((current) => ({ ...current, confirmPassword: undefined })); setError(''); }}
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-describedby={fieldErrors.confirmPassword ? 'confirm-new-password-error' : undefined}
                required
              />
              {fieldErrors.confirmPassword ? <p id="confirm-new-password-error" className="text-sm text-destructive" role="alert">{fieldErrors.confirmPassword}</p> : null}
            </div>
            {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{t(error)}</p> : null}
            <Button type="submit" size="lg" className="h-12 w-full" disabled={loading}>
              {loading ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t('Đang lưu…')}</> : locale === 'en' ? t('Auth.resetPassword') : 'Đặt lại mật khẩu'}
            </Button>
          </form>
          <div className="auth-card__footer"><Link href="/login">{locale === 'en' ? t('Auth.backToLogin') : 'Quay lại đăng nhập'}</Link></div>
        </section>
      </Container>
    </div>
  );
}
