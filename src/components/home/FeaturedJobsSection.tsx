'use client';

import { useT } from '@/context/LocaleContext';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import JobCard from '@/components/jobs/JobCard';
import { calculateSkillMatch } from '@/lib/utils';

export default function FeaturedJobsSection() {
  const t = useT();
  const { jobs, currentUser, studentProfile } = useApp();

  const featuredJobs = [...jobs].sort((a, b) => Number(Boolean(b.isFeatured || b.isHot)) - Number(Boolean(a.isFeatured || a.isHot))).slice(0, 6);

  return (
    <section id="jobs-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"> {t("Vị trí Thực tập Nổi bật & Mới nhất")} </h2>
            <p className="text-gray-500 text-sm mt-2"> {t("Các cơ hội thực tập được nhà tuyển dụng hàng đầu săn đón nhiều nhất")} </p>
          </div>

          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-sm group"
          >
            <span>{t("Xem tất cả vị trí")}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.length === 0 && <p className="text-gray-500">{t("Chưa có vị trí đang tuyển. Hãy quay lại sau.")}</p>}
            {featuredJobs.map((job) => {
            const matchScore =
              currentUser?.role === 'STUDENT'
                ? calculateSkillMatch(studentProfile.skills, job.skills)
                : undefined;

            return <JobCard key={job.id} job={job} matchScore={matchScore} />;
          })}
        </div>
      </div>
    </section>
  );
}
