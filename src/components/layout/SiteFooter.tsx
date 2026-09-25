'use client';

import Link from 'next/link';
import { useT } from '@/context/LocaleContext';

export function SiteFooter() {
  const t = useT();

  return (
    <footer className="bg-slate-900 px-6 py-12 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="text-xl font-extrabold text-white">InternMatch</Link>
          <p className="mt-3 text-sm leading-6">{t('Nền tảng kết nối thực tập sinh và doanh nghiệp')}</p>
        </div>
        <div>
          <h2 className="mb-3 font-bold text-white">{t('Thực tập sinh')}</h2>
          <ul className="space-y-3 text-sm">
            <li><Link href="/jobs">{t('Khám phá việc làm')}</Link></li>
            <li><Link href="/student/profile">{t('Hồ sơ thực tập sinh')}</Link></li>
            <li><Link href="/student/dashboard">{t('Lịch sử đơn đã ứng tuyển')}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-bold text-white">{t('Doanh nghiệp')}</h2>
          <ul className="space-y-3 text-sm">
            <li><Link href="/company/jobs/create">{t('Đăng tin tuyển dụng')}</Link></li>
            <li><Link href="/company/profile">{t('Hồ sơ doanh nghiệp')}</Link></li>
            <li><Link href="/company/dashboard">{t('Dashboard doanh nghiệp')}</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-bold text-white">{t('Liên hệ hỗ trợ')}</h2>
          <p className="text-sm leading-6">
            {t('Thông tin liên hệ chính thức sẽ được cập nhật khi có dữ liệu.')}
          </p>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-slate-700 pt-6 text-xs">
        {t('© 2026 InternMatch. Kết nối đúng cơ hội thực tập.')}
      </div>
    </footer>
  );
}
