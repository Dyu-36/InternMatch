'use client';

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/jobs", label: "Việc làm" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <Container className="site-header__inner">
        <Link className="site-brand" href="/" aria-label="InternMatch - Trang chủ" onClick={() => setOpen(false)}>
          <span className="site-brand__mark" aria-hidden="true">IM</span>
          <span>InternMatch</span>
        </Link>

        <nav className="site-header__nav" data-open={open} aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <Link key={item.href} className="site-header__nav-link" href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions" data-open={open}>
          <Link className="ui-button ui-button-ghost ui-button-sm" href="/login" onClick={() => setOpen(false)}>
            Đăng nhập
          </Link>
          <Link className="ui-button ui-button-primary ui-button-sm" href="/register" onClick={() => setOpen(false)}>
            Tạo tài khoản
          </Link>
        </div>

        <button
          className="site-header__menu-button"
          type="button"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </Container>
    </header>
  );
}
