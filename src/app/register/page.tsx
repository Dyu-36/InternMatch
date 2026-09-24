'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { Building2, GraduationCap, UserPlus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button, Container, Input } from '@/components/ui';
import type { Role } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useApp();
  const [role, setRole] = useState<Role>('STUDENT');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const requestedRole = new URLSearchParams(window.location.search).get('role');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (requestedRole === 'COMPANY' || requestedRole === 'STUDENT') setRole(requestedRole);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!username.trim() || !password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu cần có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận chưa khớp.');
      return;
    }

    setLoading(true);
    const success = register(username, password, role);
    if (!success) {
      setLoading(false);
      setError('Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.');
      return;
    }

    router.push(role === 'COMPANY' ? '/company/profile' : '/student/profile');
  };

  return (
    <main className="auth-page">
      <Container>
        <section className="auth-card auth-card--register" aria-labelledby="register-title">
          <div className="auth-card__icon auth-card__icon--green">
            <UserPlus size={28} aria-hidden="true" />
          </div>
          <div className="auth-card__header">
            <h1 id="register-title" className="auth-card__title">Tạo tài khoản mới</h1>
            <p className="auth-card__description">Tạo tài khoản để trải nghiệm các tính năng matching chuyên nghiệp</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <fieldset className="auth-role">
              <legend className="ui-label">Bạn tham gia với tư cách</legend>
              <div className="auth-role__grid">
                <button
                  type="button"
                  className={`auth-role__option ${role === 'STUDENT' ? 'is-selected' : ''}`}
                  aria-pressed={role === 'STUDENT'}
                  onClick={() => setRole('STUDENT')}
                >
                  <GraduationCap size={22} aria-hidden="true" />
                  <span>Thực tập sinh</span>
                  <small>Tìm cơ hội thực tập</small>
                </button>
                <button
                  type="button"
                  className={`auth-role__option ${role === 'COMPANY' ? 'is-selected' : ''}`}
                  aria-pressed={role === 'COMPANY'}
                  onClick={() => setRole('COMPANY')}
                >
                  <Building2 size={22} aria-hidden="true" />
                  <span>Doanh nghiệp</span>
                  <small>Đăng tin tuyển dụng</small>
                </button>
              </div>
            </fieldset>

            <Input
              label="Tên đăng nhập"
              name="username"
              autoComplete="username"
              placeholder="Chọn tên đăng nhập"
              hint="Dùng tên tài khoản này để đăng nhập về sau."
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
            <Input
              label="Mật khẩu"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <Input
              label="Nhập lại mật khẩu"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            {error ? <p className="ui-error" role="alert">{error}</p> : null}
            <Button type="submit" size="lg" fullWidth loading={loading} loadingLabel="Đang tạo tài khoản…">
              Tạo tài khoản
            </Button>
          </form>

          <p className="auth-card__hint">Không cần email công ty hoặc đăng nhập qua Google.</p>
          <div className="auth-card__footer">
            Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
