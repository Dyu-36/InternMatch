'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { KeyRound, LogIn } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button, Container, Input } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setLoading(true);
    const success = login(username, password);
    if (!success) {
      setLoading(false);
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
      return;
    }

    const next = new URLSearchParams(window.location.search).get('next');
    router.push(next?.startsWith('/') ? next : '/');
  };

  return (
    <main className="auth-page">
      <Container>
        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-card__icon auth-card__icon--blue">
            <LogIn size={28} aria-hidden="true" />
          </div>
          <div className="auth-card__header">
            <h1 id="login-title" className="auth-card__title">Đăng nhập</h1>
            <p className="auth-card__description">Chào mừng bạn quay trở lại với nền tảng InternMatch</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <Input
              label="Tên đăng nhập"
              name="username"
              autoComplete="username"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
            <Input
              label="Mật khẩu"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error ? <p className="ui-error" role="alert">{error}</p> : null}
            <Button type="submit" size="lg" fullWidth loading={loading} loadingLabel="Đang đăng nhập…">
              <KeyRound size={18} aria-hidden="true" />
              Đăng nhập
            </Button>
          </form>

          <p className="auth-card__hint">Tài khoản demo: <b>nhitran</b> hoặc <b>inuff</b> — mật khẩu <b>123456</b></p>
          <div className="auth-card__footer">
            Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
