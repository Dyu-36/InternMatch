'use client';

import { useT } from '@/context/LocaleContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Building2, GraduationCap, Loader2, UserPlus } from 'lucide-react';
import { signUp } from '@/app/actions';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Container } from '@/components/ui';
import type { Role } from '@/types';

type RegisterField = 'displayName' | 'email' | 'password' | 'confirmPassword';
type RegisterFieldErrors = Partial<Record<RegisterField, string>>;

export default function RegisterForm() {
  const t = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const role = selectedRole ?? (searchParams.get('role') === 'COMPANY' ? 'COMPANY' : 'STUDENT');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const clearFieldError = (field: RegisterField) => {
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setError('');
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});

    const nextFieldErrors: RegisterFieldErrors = {};
    if (displayName.trim().length < 2) nextFieldErrors.displayName = 'Vui lòng nhập họ tên hoặc tên công ty.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextFieldErrors.email = 'Vui lòng nhập email hợp lệ.';
    if (password.length < 8) nextFieldErrors.password = 'Mật khẩu cần có ít nhất 8 ký tự.';
    if (!confirmPassword) nextFieldErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu.';
    if (password !== confirmPassword) nextFieldErrors.confirmPassword = 'Mật khẩu xác nhận chưa khớp.';
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }

    setLoading(true);
    try {
      const response = await signUp({ displayName, email, password, confirmPassword, role });
      if (response.error || !response.data) {
        setError(response.error ?? 'Không thể tạo tài khoản. Vui lòng thử lại.');
        return;
      }
      router.replace(role === 'COMPANY' ? '/company/profile' : '/student/profile');
      router.refresh();
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Không thể tạo tài khoản. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <section className="auth-card auth-card--register" aria-labelledby="register-title">
          <div className="auth-card__icon auth-card__icon--green"><UserPlus size={28} aria-hidden="true" /></div>
          <div className="auth-card__header">
            <h1 id="register-title" className="auth-card__title">{t("Tạo tài khoản mới")}</h1>
            <p className="auth-card__description">{t("Tạo tài khoản để trải nghiệm các tính năng matching chuyên nghiệp")}</p>
          </div>
          <form className="auth-form grid gap-5" onSubmit={handleSubmit} noValidate>
            <fieldset className="grid gap-2 border-0 p-0">
              <legend className="text-sm font-medium leading-none">{t("Bạn tham gia với tư cách")}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant={role === 'STUDENT' ? 'default' : 'outline'}
                  className={`h-auto min-h-28 flex-col whitespace-normal p-4 text-center ${role === 'STUDENT' ? '' : 'hover:border-primary hover:bg-accent'}`}
                  aria-pressed={role === 'STUDENT'}
                  onClick={() => setSelectedRole('STUDENT')}
                >
                  <GraduationCap className="size-5" aria-hidden="true" />
                  <span className="grid gap-1">
                    <span className="font-semibold">{t("Thực tập sinh")}</span>
                    <span className="text-xs font-normal">{t("Tìm cơ hội thực tập")}</span>
                  </span>
                </Button>
                <Button
                  type="button"
                  variant={role === 'COMPANY' ? 'default' : 'outline'}
                  className={`h-auto min-h-28 flex-col whitespace-normal p-4 text-center ${role === 'COMPANY' ? '' : 'hover:border-primary hover:bg-accent'}`}
                  aria-pressed={role === 'COMPANY'}
                  onClick={() => setSelectedRole('COMPANY')}
                >
                  <Building2 className="size-5" aria-hidden="true" />
                  <span className="grid gap-1">
                    <span className="font-semibold">{t("Doanh nghiệp")}</span>
                    <span className="text-xs font-normal">{t("Đăng tin tuyển dụng")}</span>
                  </span>
                </Button>
              </div>
            </fieldset>

            <div className="grid gap-2">
              <Label htmlFor="register-display-name">{role === 'COMPANY' ? t('Tên doanh nghiệp') : t('Họ và tên')}</Label>
              <Input
                id="register-display-name"
                name="displayName"
                autoComplete={role === 'COMPANY' ? 'organization' : 'name'}
                placeholder={role === 'COMPANY' ? t('Tên doanh nghiệp') : t('Họ và tên')}
                value={displayName}
                onChange={(event) => { setDisplayName(event.target.value); clearFieldError('displayName'); }}
                aria-invalid={Boolean(fieldErrors.displayName)}
                aria-describedby={fieldErrors.displayName ? 'register-display-name-error' : undefined}
                required
              />
              {fieldErrors.displayName ? <p id="register-display-name-error" className="text-sm text-destructive" role="alert">{t(fieldErrors.displayName)}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={t('Nhập email')}
                value={email}
                onChange={(event) => { setEmail(event.target.value); clearFieldError('email'); }}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'register-email-error' : undefined}
                required
              />
              {fieldErrors.email ? <p id="register-email-error" className="text-sm text-destructive" role="alert">{t(fieldErrors.email)}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="register-password">{t("Mật khẩu")}</Label>
              <Input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => { setPassword(event.target.value); clearFieldError('password'); }}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'register-password-error' : undefined}
                required
              />
              {fieldErrors.password ? <p id="register-password-error" className="text-sm text-destructive" role="alert">{t(fieldErrors.password)}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="register-confirm-password">{t("Nhập lại mật khẩu")}</Label>
              <Input
                id="register-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder={t("Nhập lại mật khẩu")}
                value={confirmPassword}
                onChange={(event) => { setConfirmPassword(event.target.value); clearFieldError('confirmPassword'); }}
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-describedby={fieldErrors.confirmPassword ? 'register-confirm-password-error' : undefined}
                required
              />
              {fieldErrors.confirmPassword ? <p id="register-confirm-password-error" className="text-sm text-destructive" role="alert">{t(fieldErrors.confirmPassword)}</p> : null}
            </div>

            {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{t(error)}</p> : null}
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full"
              disabled={loading}
            >
              {loading ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t("Đang tạo tài khoản…")}</> : t("Tạo tài khoản")}
            </Button>
          </form>
          <div className="auth-card__footer">{t("Đã có tài khoản?")} <Link href="/login">{t("Đăng nhập")}</Link></div>
        </section>
      </Container>
    </div>
  );
}
