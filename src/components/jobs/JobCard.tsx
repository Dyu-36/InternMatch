'use client';
import React from 'react';
import Image from 'next/image';
import { useLocale } from '@/context/LocaleContext';
import Link from 'next/link';
import { MapPin, Banknote, Flame } from 'lucide-react';
import { Job } from '@/types';
import { formatSalary } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  matchScore?: number;
}

export default function JobCard({ job, matchScore }: JobCardProps) {
  const { locale } = useLocale();
  const initial = job.companyInitial || job.companyName.charAt(0).toUpperCase();

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="job-card group min-w-0 w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex flex-col justify-between"
    >
      <div className="min-w-0">
        {/* Header: Company & Hot Tag */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
              {job.companyLogo ? <Image src={job.companyLogo} alt={job.companyName} width={44} height={44} unoptimized className="rounded-xl object-contain" /> : initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-gray-500 uppercase tracking-wider">{job.companyName}</p>
              <h3 className="line-clamp-2 text-base font-bold leading-snug text-gray-900 group-hover:text-blue-600 transition mt-0.5">
                {job.title}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {job.isHot && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                HOT
              </span>
            )}
            {matchScore !== undefined && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                  matchScore >= 70
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : matchScore >= 40
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Match {matchScore}%
              </span>
            )}
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {job.skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-blue-50/60 text-blue-700 text-xs font-medium border border-blue-100"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info: Salary & Location */}
      <div className="min-w-0 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
        <div className="min-w-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
          <Banknote className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{formatSalary(job.minSalary, job.maxSalary, locale)}</span>
        </div>

        <div className="min-w-0 max-w-[48%] flex items-center gap-1 text-gray-500">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
          <span className="truncate">{job.location}</span>
        </div>
      </div>
    </Link>
  );
}
