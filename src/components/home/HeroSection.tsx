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
import { VnLocationPicker } from '@/components/ui/VnAddressFields';
import { cn } from '@/lib/utils';

const POPULAR_ROLES = [
  'React Developer', 'UI/UX Design', 'Data Analyst',
  'Digital Marketing', 'Business Analyst', 'Finance Intern',
];

export default function HeroSection() {
  const t = useT();
  const router = useRouter();
  const { jobs } = useApp();
  const [keyword, setKeyword] = useState('');
  const [province, setProvince] = useState('');
  const [ward, setWard] = useState('');
  const [jobType, setJobType] = useState('ALL');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (province) params.set('province', province);
    if (ward) params.set('ward', ward);
    if (jobType && jobType !== 'ALL') params.set('type', jobType);
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const companyCount = new Set(jobs.map(job => job.companyId)).size;

  return (
    <section
      className="relative overflow-hidden text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "linear-gradient(135deg, rgb(62 12 30 / 0.94), rgb(157 13 47 / 0.86)), url('/assets/backgrounds/pexels-students-internship-teamwork-7429464-1.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none max-sm:hidden"
        style={{ background: 'radial-gradient(circle, #b4204a, transparent)', transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 pointer-events-none max-sm:hidden"
        style={{ background: 'radial-gradient(circle, #b4204a, transparent)', transform: 'translate(-30%, 30%)' }}
      />

      <div className="relative max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-wine-400/40 bg-white/10 px-4 py-1.5 text-xs font-medium text-wine-200 backdrop-blur-md sm:text-sm">
          <TrendingUp className="h-3.5 w-3.5 text-wine-300" aria-hidden="true" />
          <span>{jobs.length} {t('tin tuyển dụng')}</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Match the talent, meet the opportunity
        </h1>

        <p className="mx-auto max-w-2xl text-base leading-relaxed text-wine-200/85 sm:text-lg">
          {t('Tìm cơ hội thực tập phù hợp với kỹ năng, địa điểm và mục tiêu nghề nghiệp của bạn.')}
        </p>
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-2xl max-w-4xl mx-auto text-gray-800">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
            <div className="md:col-span-4 hero-search-field flex items-center gap-2 px-3 py-2 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-200 transition">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <div className="relative flex min-w-0 flex-1">
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-opacity',
                    keyword && 'opacity-0',
                  )}
                >
                  {t("Vị trí, kỹ năng (Python, React...)")}
                </span>
                <ShadcnInput
                  type="text"
                  aria-label={t("Tìm theo vị trí hoặc kỹ năng")}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="h-auto w-full border-0 bg-transparent px-0 py-0 text-sm text-gray-800 shadow-none focus-visible:border-0 focus-visible:ring-0"
                />
              </div>
            </div>
            <VnLocationPicker
              id="hero-location"
              label={t("Địa điểm")}
              provinceCode={province}
              wardCode={ward}
              onProvinceChange={setProvince}
              onWardChange={setWard}
              placeholder={t("Tỉnh / Thành phố")}
              provinceSearchPlaceholder={t("Gõ tên tỉnh / thành phố...")}
              wardSearchPlaceholder={t("Gõ tên xã / phường / đặc khu...")}
              provinceEmptyText={t("Chưa có dữ liệu tỉnh / thành phố.")}
              wardEmptyText={t("Chưa có dữ liệu xã / phường / đặc khu.")}
              clearLabel="Xóa địa điểm"
              clearWardLabel="Bỏ chọn xã / phường / đặc khu"
              backLabel="Tỉnh khác"
              unitsLabel="đơn vị"
              icon={<MapPin className="w-4 h-4 text-gray-400 shrink-0" />}
              className="md:col-span-3 hero-search-field flex items-center gap-2 px-3 py-2 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-200 transition"
              triggerClassName="h-auto w-full border-0 bg-transparent px-0 py-0 text-sm text-gray-700 shadow-none hover:bg-transparent focus-visible:border-0 focus-visible:ring-0"
            />
            <div className="md:col-span-3 hero-search-field flex items-center gap-2 px-3 py-2 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-200 transition">
              <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
              <ShadcnSelect value={jobType} onValueChange={setJobType}>
                <SelectTrigger aria-label={t("Hình thức làm việc")} className="h-auto w-full border-0 bg-transparent px-0 py-0 text-sm text-gray-700 shadow-none focus-visible:border-0 focus-visible:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t('Tất cả hình thức')}</SelectItem>
                  <SelectItem value="Thực tập Toàn thời gian">{t('Thực tập Toàn thời gian')}</SelectItem>
                  <SelectItem value="Thực tập Bán thời gian">{t('Thực tập Bán thời gian')}</SelectItem>
                  <SelectItem value="Remote">{t('Làm việc từ xa (Remote)')}</SelectItem>
                </SelectContent>
              </ShadcnSelect>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="h-11 w-full rounded-xl bg-[var(--accent-strong)] px-4 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--accent-strong)]/90">
                <Search className="w-4 h-4" />
                <span>{t("Tìm ngay")}</span>
              </Button>
            </div>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-wine-300/70">{t('Gợi ý tìm kiếm')}:</span>
          {POPULAR_ROLES.map((role) => (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              key={role}
              onClick={() => setKeyword(role)}
              className="h-auto rounded-full border border-wine-400/40 px-3 py-1 text-xs font-medium text-wine-200 transition-colors hover:border-wine-300 hover:bg-wine-800/40 hover:text-wine-200"
            >
              {t(role)}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-2 text-xs sm:text-sm text-wine-200/70 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-wine-300" />
            <span>{jobs.length} {t('tin tuyển dụng')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-wine-300" aria-hidden="true" />
            <span>{companyCount} {t('doanh nghiệp đang tuyển')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-wine-300" />
            <span>{t("Kết nối dựa trên kỹ năng")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
