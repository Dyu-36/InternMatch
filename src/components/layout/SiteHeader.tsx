'use client';

import { useT } from '@/context/LocaleContext';

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { useApp } from '@/context/AppContext';
import { useLocale } from '@/context/LocaleContext';

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/jobs", label: "Việc làm" },
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
          <span className="site-brand__mark" aria-hidden="true">IM</span>
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
          <button type="button" className="ui-button ui-button-ghost ui-button-sm" aria-label="Change language" onClick={() => setLocale(locale === 'vi' ? 'en' : 'vi')}>{locale === 'vi' ? 'EN' : 'VI'}</button>
          {currentUser ? <>
            <Link className="ui-button ui-button-ghost ui-button-sm" href={dashboard} onClick={() => setOpen(false)}>Dashboard</Link>
            <button type="button" className="ui-button ui-button-secondary ui-button-sm" disabled={busy} onClick={async () => {
              setBusy(true); setError('');
              try { await logout(); setOpen(false); } catch { setError(t("Không thể đăng xuất. Vui lòng thử lại.")); } finally { setBusy(false); }
            }}>{t("Đăng xuất")}</button>
          </> : <>
          <Link className="ui-button ui-button-ghost ui-button-sm" href="/login" onClick={() => setOpen(false)}> {t("Đăng nhập")} </Link>
          <Link className="ui-button ui-button-primary ui-button-sm" href="/register" onClick={() => setOpen(false)}> {t("Tạo tài khoản")} </Link>
          </>}
          {error && <span role="alert" className="ui-error">{t(error)}</span>}
        </div>

        <button
          className="site-header__menu-button"
          type="button"
          aria-label={open ? t("Đóng menu") : t("Mở menu")}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </Container>
    </header>
  );
}
