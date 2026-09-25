'use client';

import Link from 'next/link';
import { Code2, Megaphone, DollarSign, Palette, LineChart, UserCheck } from 'lucide-react';
import { useT } from '@/context/LocaleContext';

const CATEGORIES = [
  { slug: 'information-technology', label: 'Công nghệ thông tin', Icon: Code2, color: 'bg-blue-50 text-blue-600' },
  { slug: 'marketing-communications', label: 'Marketing & Truyền thông', Icon: Megaphone, color: 'bg-purple-50 text-purple-600' },
  { slug: 'finance-accounting', label: 'Tài chính - Kế toán', Icon: DollarSign, color: 'bg-amber-50 text-amber-600' },
  { slug: 'design-creative', label: 'Thiết kế & Sáng tạo', Icon: Palette, color: 'bg-pink-50 text-pink-600' },
  { slug: 'business-sales', label: 'Kinh doanh & Bán hàng', Icon: LineChart, color: 'bg-emerald-50 text-emerald-600' },
  { slug: 'human-resources-administration', label: 'Nhân sự & Hành chính', Icon: UserCheck, color: 'bg-orange-50 text-orange-600' },
] as const;

export default function CategoriesSection() {
  const t = useT();

  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {t('Khám phá theo ngành nghề')}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {t('Tìm kiếm vị trí thực tập theo lĩnh vực bạn yêu thích')}
            </p>
          </div>
          <Link
            href="/jobs"
            className="hidden items-center gap-1 text-sm font-semibold text-[var(--accent-strong)] hover:underline sm:flex"
          >
            {t('Xem tất cả →')}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/jobs?industry=${category.slug}`}
              className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
            >
              <span className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${category.color}`} aria-hidden="true">
                <category.Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold leading-tight text-gray-800 transition-colors group-hover:text-emerald-700">
                {t(category.label)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
