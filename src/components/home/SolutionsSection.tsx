'use client';

import { useT } from '@/context/LocaleContext';
import React from 'react';
import { Zap, ShieldCheck, LayoutDashboard } from 'lucide-react';

export default function SolutionsSection() {
  const t = useT();
  const solutions = [
    {
      icon: Zap,
      iconBg: 'bg-blue-50 text-blue-600',
      title: 'Thuật toán Matching Kỹ năng',
      description: 'Gợi ý vị trí tuyển dụng dựa trên các kỹ năng trong hồ sơ sinh viên.',
    },
    {
      icon: ShieldCheck,
      iconBg: 'bg-emerald-50 text-emerald-600',
      title: 'Thông tin doanh nghiệp rõ ràng',
      description: 'Xem hồ sơ doanh nghiệp, yêu cầu công việc và quyền lợi trước khi ứng tuyển.',
    },
    {
      icon: LayoutDashboard,
      iconBg: 'bg-amber-50 text-amber-600',
      title: 'Quản lý hồ sơ & Tuyển dụng 1 chạm',
      description: 'Hệ thống Dashboard trực quan giúp sinh viên theo dõi trạng thái đơn và giúp nhà tuyển dụng xét duyệt ứng viên tức thì.',
    },
  ];

  return (
    <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wider uppercase mb-3">
          {t("Giá trị khác biệt")}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          {t("Giải pháp tối ưu cho cả Doanh nghiệp & Sinh viên")}
        </h2>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-12">
          {t("InternMatch rút ngắn khoảng cách từ nhà trường đến môi trường doanh nghiệp thực tế.")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {solutions.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-start"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.iconBg}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t(item.title)}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t(item.description)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
