'use client';

import { useT } from '@/context/LocaleContext';

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/shadcn/button';
import { useLocale } from '@/context/LocaleContext';

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/jobs", label: "Việc làm" },
  { href: "/company/jobs/create", label: "Tuyển dụng" },
];

export function SiteHeader() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useApp();
  const { locale, setLocale } = useLocale();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dashboard = currentUser?.role === 'COMPANY' ? '/company/dashboard' : '/student/dashboard';

  return (
    <header className="site-header">
      <Container className="site-header__inner">
        <Link className="site-brand" href="/" aria-label={t("InternMatch - Trang chủ")} onClick={() => setOpen(false)}>
          <Image
            className="site-brand__logo"
            src="/brand/internmatch-logo.png"
            alt=""
            width={36}
            height={36}
            priority
          />
          <span>InternMatch</span>
        </Link>

        <nav className="site-header__nav" data-open={open} aria-label={t("Điều hướng chính")}>
          {navItems.map((item) => (
            <Link key={item.href} className="site-header__nav-link" href={item.href} onClick={() => setOpen(false)}>
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions" data-open={open}>
          <Button type="button" variant="ghost" size="sm" aria-label="Change language" onClick={() => setLocale(locale === 'vi' ? 'en' : 'vi')}>{locale === 'vi' ? 'EN' : 'VI'}</Button>
          {currentUser ? <>
            <Button asChild variant="ghost" size="sm"><Link href={dashboard} onClick={() => setOpen(false)}>Dashboard</Link></Button>
            <Button type="button" variant="outline" size="sm" disabled={busy} onClick={async () => {
              setBusy(true); setError('');
              try { await logout(); setOpen(false); } catch { setError(t("Không thể đăng xuất. Vui lòng thử lại.")); } finally { setBusy(false); }
            }}>{t("Đăng xuất")}</Button>
          </> : <>
          <Button asChild variant="ghost" size="sm"><Link href="/login" onClick={() => setOpen(false)}>{t("Đăng nhập")}</Link></Button>
          <Button asChild size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700"><Link href="/register" onClick={() => setOpen(false)}>{t("Tạo tài khoản")}</Link></Button>
          </>}
          {error && <span role="alert" className="ui-error">{t(error)}</span>}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="site-header__menu-button"
          type="button"
          aria-label={open ? t("Đóng menu") : t("Mở menu")}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </Container>
    </header>
  );
}
