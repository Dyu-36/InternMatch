'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useT } from '@/context/LocaleContext';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/shadcn/button';
import JobCard from '@/components/jobs/JobCard';
import { calculateSkillMatch } from '@/lib/utils';
import type { JobType } from '@/types';

type JobTypeFilter = JobType | 'ALL';

const FILTER_TABS: ReadonlyArray<{ label: string; value: JobTypeFilter }> = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Thực tập Toàn thời gian', value: 'Thực tập Toàn thời gian' },
  { label: 'Thực tập Bán thời gian', value: 'Thực tập Bán thời gian' },
  { label: 'Làm việc từ xa (Remote)', value: 'Remote' },
];

export default function FeaturedJobsSection() {
  const t = useT();
  const { jobs, currentUser, studentProfile } = useApp();
  const [activeFilter, setActiveFilter] = useState<JobTypeFilter>('ALL');

  const visibleJobs = useMemo(() => jobs
    .filter((job) => activeFilter === 'ALL' || job.jobType === activeFilter)
    .sort((a, b) => {
      const featuredDifference = Number(Boolean(b.isFeatured || b.isHot))
        - Number(Boolean(a.isFeatured || a.isHot));
      return featuredDifference || b.createdAt.localeCompare(a.createdAt);
    })
    .slice(0, 6), [activeFilter, jobs]);

  return (
    <section id="jobs-section" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {t('Vị trí Thực tập Nổi bật & Mới nhất')}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {t('Các cơ hội thực tập được nhà tuyển dụng hàng đầu săn đón nhiều nhất')}
            </p>
          </div>
          <Link
            href="/jobs"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-strong)] hover:underline"
          >
            <span>{t('Xem tất cả vị trí')}</span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1" aria-label={t('Lọc theo hình thức')}>
          {FILTER_TABS.map((tab) => (
            <Button
              type="button"
              variant={activeFilter === tab.value ? 'default' : 'outline'}
              size="sm"
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              aria-pressed={activeFilter === tab.value}
              className={`h-auto rounded-full px-4 py-1.5 text-sm font-medium ${activeFilter === tab.value ? 'bg-[var(--accent-strong)] text-white hover:bg-[var(--accent-strong)]/90' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {t(tab.label)}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleJobs.length === 0 && (
            <p className="col-span-full rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
              {jobs.length === 0
                ? t('Chưa có vị trí đang tuyển. Hãy quay lại sau.')
                : t('Không có vị trí phù hợp với bộ lọc này.')}
            </p>
          )}
          {visibleJobs.map((job) => {
            const matchScore = currentUser?.role === 'STUDENT'
              ? calculateSkillMatch(studentProfile.skills, job.skills)
              : undefined;
            return <JobCard key={job.id} job={job} matchScore={matchScore} />;
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent-strong)] px-7 py-3 text-sm font-semibold text-[var(--accent-strong)] transition hover:bg-[var(--accent-soft)]"
          >
            {t('Xem tất cả vị trí')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
