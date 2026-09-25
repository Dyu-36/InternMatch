'use client';

import { useT } from '@/context/LocaleContext';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/shadcn/button';
import JobCard from '@/components/jobs/JobCard';
import { calculateSkillMatch } from '@/lib/utils';

const FILTER_TABS = ['Tất cả', 'IT', 'Marketing', 'Thiết kế', 'Tài chính'];

export default function FeaturedJobsSection() {
  const t = useT();
  const { jobs, currentUser, studentProfile } = useApp();
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  const featuredJobs = [...jobs]
    .sort((a, b) => Number(Boolean(b.isFeatured || b.isHot)) - Number(Boolean(a.isFeatured || a.isHot)))
    .slice(0, 6);

  return (
    <section id="jobs-section" className="py-20 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("Thực tập nổi bật")}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {t("Được cập nhật hàng ngày từ doanh nghiệp uy tín")}
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-semibold text-sm group"
          >
            <span>{t("Xem tất cả vị trí")}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {FILTER_TABS.map((tab) => (
            <Button
              type="button"
              variant={activeFilter === tab ? 'default' : 'outline'}
              size="sm"
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`h-auto rounded-full px-4 py-1.5 text-sm font-medium ${activeFilter === tab ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {t(tab)}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.length === 0 && (
            <p className="text-gray-500">{t("Chưa có vị trí đang tuyển. Hãy quay lại sau.")}</p>
          )}
          {featuredJobs.map((job) => {
            const matchScore =
              currentUser?.role === 'STUDENT'
                ? calculateSkillMatch(studentProfile.skills, job.skills)
                : undefined;
            return <JobCard key={job.id} job={job} matchScore={matchScore} />;
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold text-sm transition"
          >
            {t("Xem tất cả vị trí thực tập")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
