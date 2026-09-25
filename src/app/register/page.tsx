'use client';

import { useT } from '@/context/LocaleContext';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { Building2, GraduationCap, Loader2, UserPlus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Container } from '@/components/ui';
import type { Role } from '@/types';

type RegisterField = 'username' | 'password' | 'confirmPassword';
type RegisterFieldErrors = Partial<Record<RegisterField, string>>;

export default function RegisterPage() {
  const t = useT();
  const router = useRouter();
  const { register } = useApp();
  const [role, setRole] = useState<Role>('STUDENT');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const clearFieldError = (field: RegisterField) => {
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setError('');
  };

  useEffect(() => {
    const requestedRole = new URLSearchParams(window.location.search).get('role');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (requestedRole === 'COMPANY' || requestedRole === 'STUDENT') setRole(requestedRole);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setFieldErrors({});

    const nextFieldErrors: RegisterFieldErrors = {};
    if (!username.trim()) nextFieldErrors.username = 'Vui lòng nhập tên đăng nhập.';
    if (!password) nextFieldErrors.password = 'Vui lòng nhập mật khẩu.';
    if (!confirmPassword) nextFieldErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu.';
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }
    if (password.length < 6) {
      setFieldErrors({ password: 'Mật khẩu cần có ít nhất 6 ký tự.' });
      setError('Mật khẩu cần có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'Mật khẩu xác nhận chưa khớp.' });
      setError('Mật khẩu xác nhận chưa khớp.');
      return;
    }

    setLoading(true);
    try {
      const success = await register(username, password, role);
      if (!success) {
        setError('Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.');
        return;
      }
      router.push(role === 'COMPANY' ? '/company/profile' : '/student/profile');
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Không thể tạo tài khoản. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
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
                  className={`h-auto min-h-28 flex-col whitespace-normal p-4 text-center ${role === 'STUDENT' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'hover:border-emerald-600 hover:bg-emerald-50'}`}
                  aria-pressed={role === 'STUDENT'}
                  onClick={() => setRole('STUDENT')}
                >
                  <GraduationCap className="size-5" aria-hidden="true" />
                  <span className="grid gap-1">
                    <span className="font-semibold">{t("Thực tập sinh")}</span>
                    <span className="text-xs font-normal opacity-80">{t("Tìm cơ hội thực tập")}</span>
                  </span>
                </Button>
                <Button
                  type="button"
                  variant={role === 'COMPANY' ? 'default' : 'outline'}
                  className={`h-auto min-h-28 flex-col whitespace-normal p-4 text-center ${role === 'COMPANY' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'hover:border-emerald-600 hover:bg-emerald-50'}`}
                  aria-pressed={role === 'COMPANY'}
                  onClick={() => setRole('COMPANY')}
                >
                  <Building2 className="size-5" aria-hidden="true" />
                  <span className="grid gap-1">
                    <span className="font-semibold">{t("Doanh nghiệp")}</span>
                    <span className="text-xs font-normal opacity-80">{t("Đăng tin tuyển dụng")}</span>
                  </span>
                </Button>
              </div>
            </fieldset>

            <div className="grid gap-2">
              <Label htmlFor="register-username">{t("Tên đăng nhập")}</Label>
              <Input
                id="register-username"
                name="username"
                autoComplete="username"
                placeholder={t("Chọn tên đăng nhập")}
                value={username}
                onChange={(event) => { setUsername(event.target.value); clearFieldError('username'); }}
                aria-invalid={Boolean(fieldErrors.username)}
                aria-describedby={fieldErrors.username ? 'register-username-error' : 'register-username-hint'}
                required
              />
              <p id="register-username-hint" className="text-xs text-muted-foreground">{t("Dùng tên tài khoản này để đăng nhập về sau.")}</p>
              {fieldErrors.username ? <p id="register-username-error" className="text-sm text-destructive" role="alert">{t(fieldErrors.username)}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="register-password">{t("Mật khẩu")}</Label>
              <Input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder={t("Tối thiểu 6 ký tự")}
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
              className="h-12 w-full bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t("Đang tạo tài khoản…")}</> : t("Tạo tài khoản")}
            </Button>
          </form>
          <p className="auth-card__hint">{t("Không cần email công ty hoặc đăng nhập qua Google.")}</p>
          <div className="auth-card__footer">{t("Đã có tài khoản?")} <Link href="/login">{t("Đăng nhập")}</Link></div>
        </section>
      </Container>
    </main>
  );
}
