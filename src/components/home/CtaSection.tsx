'use client';

import { useT } from '@/context/LocaleContext';
import React from 'react';
import Link from 'next/link';
import { GraduationCap, Building2, ArrowRight } from 'lucide-react';

export default function CtaSection() {
  const t = useT();
  return (
    <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="rounded-2xl p-8 flex flex-col justify-between min-h-[240px]"
          style={{ background: 'linear-gradient(135deg, #022C22, #065F46)' }}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {t("Dành cho Sinh viên")}
            </h3>
            <p className="text-emerald-200/80 text-sm leading-relaxed mb-6">
              {t("Tạo hồ sơ ấn tượng, tìm kiếm cơ hội thực tập phù hợp và theo dõi quá trình ứng tuyển một cách dễ dàng.")}
            </p>
          </div>
          <Link
            href="/register?role=STUDENT"
            className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition shadow-md"
          >
            {t("Đăng ký thực tập ngay")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="rounded-2xl p-8 bg-white border border-gray-200 shadow-sm flex flex-col justify-between min-h-[240px]">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t("Dành cho Doanh nghiệp")}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {t("Tiếp cận hàng ngàn sinh viên tài năng, đăng tin tuyển dụng thực tập và quản lý hồ sơ ứng viên hiệu quả.")}
            </p>
          </div>
          <Link
            href="/register?role=COMPANY"
            className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition shadow-md"
          >
            {t("Đăng tin tuyển dụng")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
