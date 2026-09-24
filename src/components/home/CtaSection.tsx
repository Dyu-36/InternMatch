import React from 'react';
import Link from 'next/link';
import { GraduationCap, Building2 } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white p-8 sm:p-12 lg:p-16 text-center shadow-xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Bạn đã sẵn sàng khởi động sự nghiệp tương lai?
          </h2>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed font-normal">
            Tạo hồ sơ chỉ trong 2 phút để tiếp cận hàng trăm cơ hội thực tập hấp dẫn hoặc đăng tin để tìm kiếm thế hệ nhân tài kế cận ngay hôm nay!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register?role=STUDENT"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-lg transition active:scale-98"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Đăng ký Thực tập sinh</span>
            </Link>

            <Link
              href="/register?role=COMPANY"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-white hover:bg-gray-100 text-blue-700 font-bold text-base shadow-lg transition active:scale-98"
            >
              <Building2 className="w-5 h-5" />
              <span>Dành cho Doanh nghiệp</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
