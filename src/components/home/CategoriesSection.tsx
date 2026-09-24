import Link from 'next/link';
import { Code2, Megaphone, DollarSign, Palette, LineChart, UserCheck } from 'lucide-react';

const CATEGORIES = [
  { Icon: Code2, label: 'Công nghệ thông tin', count: 1240, color: 'bg-blue-50 text-blue-600' },
  { Icon: Megaphone, label: 'Marketing & Truyền thông', count: 820, color: 'bg-purple-50 text-purple-600' },
  { Icon: DollarSign, label: 'Tài chính - Kế toán', count: 610, color: 'bg-amber-50 text-amber-600' },
  { Icon: Palette, label: 'Thiết kế & Sáng tạo', count: 430, color: 'bg-pink-50 text-pink-600' },
  { Icon: LineChart, label: 'Kinh doanh & Bán hàng', count: 950, color: 'bg-emerald-50 text-emerald-600' },
  { Icon: UserCheck, label: 'Nhân sự & Hành chính', count: 380, color: 'bg-orange-50 text-orange-600' },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Khám phá theo ngành nghề
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Tìm kiếm vị trí thực tập theo lĩnh vực bạn yêu thích
            </p>
          </div>
          <Link
            href="/jobs"
            className="hidden sm:flex items-center gap-1 text-sm text-emerald-600 font-semibold hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href="/jobs"
              className="group bg-white rounded-xl border border-gray-200 p-5 flex flex-col items-center text-center hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${cat.color}`}>
                <cat.Icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-tight mb-1 group-hover:text-emerald-700 transition-colors">
                {cat.label}
              </p>
              <p className="text-xs text-gray-500">{cat.count.toLocaleString()} vị trí</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
