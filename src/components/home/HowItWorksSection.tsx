'use client';

import Link from 'next/link';
import { UserCheck, Search, CheckCircle2 } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { Button } from '@/components/shadcn/button';

const STEPS = [
  {
    step: 1,
    Icon: UserCheck,
    title: 'Tạo hồ sơ',
    desc: 'Cập nhật thông tin đầy đủ để tăng độ tin cậy và cơ hội kết nối thành công.',
  },
  {
    step: 2,
    Icon: Search,
    title: 'Tìm & ứng tuy tuyển',
    desc: 'Khám phá các vị trí đang tuyển và tìm công việc phù hợp với kỹ năng, ngành học và mục tiêu nghề nghiệp của bạn.',
  },
  {
    step: 3,
    Icon: CheckCircle2,
    title: 'Nhận phản hồi',
    desc: 'Theo dõi đơn ứng tuyển và nhận gợi ý việc làm theo kỹ năng của bạn.',
  },
] as const;

export default function HowItWorksSection() {
  const t = useT();

  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          {t('Bắt đầu chỉ trong 3 bước')}
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-sm text-gray-500">
          {t('Quy trình đơn giản, nhanh chóng để bạn sớm có được cơ hội thực tập mơ ước')}
        </p>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.step} className="flex flex-col items-center">
              <div className="relative mb-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-md">
                  <step.Icon className="h-8 w-8 text-[var(--accent-strong)]" aria-hidden="true" />
                </div>
                <span className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-strong)] text-xs font-bold text-white">
                  {step.step}
                </span>
              </div>
              <h3 className="mb-2 text-base font-bold text-gray-900">{t(step.title)}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-gray-500">{t(step.desc)}</p>
            </div>
          ))}
        </div>

        <Button asChild className="mt-12 h-auto rounded-xl px-7 py-3.5 text-sm shadow-lg">
          <Link href="/register?role=STUDENT">
            {t('Tạo hồ sơ')}
            <span aria-hidden="true">→</span>
          </Link>
        </Button>
      </div>
    </section>
  );
}
