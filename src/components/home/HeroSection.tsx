'use client';

import { useT } from '@/context/LocaleContext';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Briefcase, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

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

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#102d75] via-[#143d99] to-[#1e4db7] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-8">
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{t("Nền tảng kết nối thực tập sinh và doanh nghiệp")}</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none text-white max-w-4xl mx-auto"> {t("Kết nối tài năng trẻ với")}{' '}
          <span className="text-amber-400 drop-shadow-sm">{t("Doanh nghiệp")}</span>{' '} {t("hàng đầu")} </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed font-normal"> {t("Tìm kiếm cơ hội thực tập có trợ cấp, học hỏi từ mentor giàu kinh nghiệm và mở khóa lộ trình trở thành nhân viên chính thức ngay khi còn ngồi trên ghế nhà trường.")} </p>

        {/* Floating Search Form */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-2xl max-w-4xl mx-auto text-gray-800">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
            {/* Search Keyword */}
            <div className="md:col-span-4 flex items-center gap-2 px-3 py-2 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-200 transition">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                aria-label={t("Tìm theo vị trí hoặc kỹ năng")} placeholder={t("Vị trí, kỹ năng (Python, React...)")}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full text-sm bg-transparent outline-none placeholder-gray-400 text-gray-800"
              />
            </div>

            {/* Location */}
            <div className="md:col-span-3 flex items-center gap-2 px-3 py-2 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-200 transition">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                aria-label={t("Địa điểm")} placeholder={t("Hà Nội, TP.HCM, Remote")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm bg-transparent outline-none placeholder-gray-400 text-gray-800"
              />
            </div>

            {/* Job Type Dropdown */}
            <div className="md:col-span-3 flex items-center gap-2 px-3 py-2 bg-gray-50/70 hover:bg-gray-100/70 rounded-xl border border-gray-200 transition">
              <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
              <select aria-label={t("Hình thức làm việc")}
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full text-sm bg-transparent outline-none text-gray-700 cursor-pointer"
              >
                <option value="ALL">{t("Tất cả hình thức")}</option>
                <option value="Thực tập Toàn thời gian">{t("Toàn thời gian")}</option>
                <option value="Thực tập Bán thời gian">{t("Bán thời gian")}</option>
                <option value="Remote">{t("Làm việc từ xa (Remote)")}</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full h-11 flex items-center justify-center gap-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md active:scale-98"
              >
                <Search className="w-4 h-4" />
                <span>{t("Tìm ngay")}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Counter & Social Proof Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-4 text-xs sm:text-sm text-blue-200 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{jobs.length} {t("tin tuyển dụng")}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{new Set(jobs.map(job => job.companyId)).size} {t("doanh nghiệp đang tuyển")}</span>
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
