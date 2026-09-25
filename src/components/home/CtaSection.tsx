'use client';

import Link from 'next/link';
import { GraduationCap, Building2, ArrowRight } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { Button } from '@/components/shadcn/button';

export default function CtaSection() {
  const t = useT();

  return (
    <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {t('Bạn đã sẵn sàng khởi động sự nghiệp tương lai?')}
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          {t('Tạo hồ sơ để gửi thông tin đến nhà tuyển dụng.')}
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex min-h-[240px] flex-col justify-between rounded-2xl bg-[var(--accent-strong)] p-8 text-white">
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-xl font-bold">{t('Dành cho Sinh viên')}</h3>
            <p className="mb-6 text-sm leading-relaxed text-emerald-50">
              {t('Tạo hồ sơ để gửi thông tin đến nhà tuyển dụng và theo dõi quá trình ứng tuy tuyển.')}
            </p>
          </div>
          <Button asChild variant="secondary" className="self-start rounded-xl font-bold text-[var(--accent-strong)]">
            <Link href="/register?role=STUDENT">
              {t('Đăng ký Thực tập sinh')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="flex min-h-[240px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <Building2 className="h-5 w-5 text-[var(--accent-strong)]" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">{t('Dành cho Doanh nghiệp')}</h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-500">
              {t('Đăng tin tuyển dụng và quản lý hồ sơ ứng viên tại cùng một nơi.')}
            </p>
          </div>
          <Button asChild className="self-start rounded-xl bg-[var(--accent-strong)] font-bold text-white hover:bg-[var(--accent-strong)]/90">
            <Link href="/register?role=COMPANY">
              {t('Đăng tin tuyển dụng')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
