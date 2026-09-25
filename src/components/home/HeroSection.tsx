'use client';

import { useT } from '@/context/LocaleContext';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Briefcase, CheckCircle2, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/shadcn/button';
import { Input as ShadcnInput } from '@/components/shadcn/input';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';

const POPULAR_ROLES = [
  'React Developer', 'UI/UX Design', 'Data Analyst',
  'Digital Marketing', 'Business Analyst', 'Finance Intern',
];

export default function HeroSection() {
  const t = useT();
  const router = useRouter();
  const { jobs } = useApp();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('ALL');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (location) params.set('location', location);
    if (jobType && jobType !== 'ALL') params.set('type', jobType);
    router.push(`/jobs?${params.toString()}`);
  };

  const companyCount = new Set(jobs.map(job => job.companyId)).size;

  return (
    <section
      className="relative overflow-hidden text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "linear-gradient(135deg, rgb(2 44 34 / 0.94), rgb(6 78 59 / 0.86)), url('/assets/backgrounds/pexels-students-internship-teamwork-7429464-1.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #10b981, transparent)', transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #10b981, transparent)', transform: 'translate(-30%, 30%)' }}
      />

      <div className="relative max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-emerald-700/50 text-emerald-200 text-xs sm:text-sm font-medium">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>{jobs.length > 0 ? jobs.length : '8,500'}+ {t("vị trí thực tập đang tuyển")}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white max-w-4xl mx-auto">
          {t("Kết nối thực tập —")}{' '}
          <span className="text-emerald-400">{t("Bước đầu sự nghiệp")}</span>
        </h1>

        <p className="text-base sm:text-lg text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
          {t("Hàng ngàn vị trí thực tập từ công ty hàng đầu Việt Nam. Tìm cơ hội phù hợp và khởi đầu hành trình của bạn.")}
        </p>

        <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-2xl max-w-4xl mx-auto text-gray-800">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
            <div className="md:col-span-4 hero-search-field flex items-center gap-2 px-3 py-2 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-200 transition">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <ShadcnInput
                type="text"
                aria-label={t("Tìm theo vị trí hoặc kỹ năng")}
                placeholder={t("Vị trí, kỹ năng (Python, React...)")}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-auto w-full border-0 bg-transparent px-0 py-0 text-sm text-gray-800 shadow-none placeholder:text-gray-400 focus-visible:border-0 focus-visible:ring-0"
              />
            </div>
            <div className="md:col-span-3 hero-search-field flex items-center gap-2 px-3 py-2 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-200 transition">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <ShadcnInput
                type="text"
                aria-label={t("Địa điểm")}
                placeholder={t("Hà Nội, TP.HCM, Remote")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-auto w-full border-0 bg-transparent px-0 py-0 text-sm text-gray-800 shadow-none placeholder:text-gray-400 focus-visible:border-0 focus-visible:ring-0"
              />
            </div>
            <div className="md:col-span-3 hero-search-field flex items-center gap-2 px-3 py-2 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-200 transition">
              <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
              <ShadcnSelect value={jobType} onValueChange={setJobType}>
                <SelectTrigger aria-label={t("Hình thức làm việc")} className="h-auto w-full border-0 bg-transparent px-0 py-0 text-sm text-gray-700 shadow-none focus-visible:border-0 focus-visible:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t("Tất cả hình thức")}</SelectItem>
                  <SelectItem value="Thực tập Toàn thời gian">{t("Toàn thời gian")}</SelectItem>
                  <SelectItem value="Thực tập Bán thời gian">{t("Bán thời gian")}</SelectItem>
                  <SelectItem value="Remote">{t("Remote")}</SelectItem>
                </SelectContent>
              </ShadcnSelect>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="h-11 w-full rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700">
                <Search className="w-4 h-4" />
                <span>{t("Tìm ngay")}</span>
              </Button>
            </div>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-emerald-300/70 text-sm">{t("Phổ biến")}:</span>
          {POPULAR_ROLES.map((role) => (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              key={role}
              onClick={() => setKeyword(role)}
              className="h-auto rounded-full border border-emerald-700/50 px-3 py-1 text-xs font-medium text-emerald-200 transition-colors hover:border-emerald-500 hover:bg-emerald-800/40 hover:text-emerald-100"
            >
              {t(role)}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-2 text-xs sm:text-sm text-emerald-200/70 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{jobs.length > 0 ? jobs.length : '8,500'}+ {t("tin tuyển dụng")}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{companyCount > 0 ? companyCount : '2,500'}+ {t("doanh nghiệp đang tuyển")}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t("Kết nối dựa trên kỹ năng")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
