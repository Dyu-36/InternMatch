'use client';

import { useMemo } from 'react';
import { Building2, Briefcase } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { useApp } from '@/context/AppContext';

export default function StatsSection() {
  const t = useT();
  const { jobs } = useApp();
  const companyCount = useMemo(
    () => new Set(jobs.map((job) => job.companyId).filter(Boolean)).size,
    [jobs],
  );
  const stats = [
    { value: jobs.length, label: 'Vị trí đang tuyển', Icon: Briefcase },
    { value: companyCount, label: 'doanh nghiệp đang tuyển', Icon: Building2 },
  ];

  return (
    <section className="bg-[var(--accent-strong)] px-4 py-16 text-white">
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <stat.Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mb-1 text-4xl font-bold">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-emerald-50">{t(stat.label)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
