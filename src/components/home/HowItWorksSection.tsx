import Link from 'next/link';
import { UserCheck, Search, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    step: 1,
    Icon: UserCheck,
    title: 'Tạo hồ sơ',
    desc: 'Điền thông tin cá nhân, kỹ năng và mục tiêu nghề nghiệp của bạn chỉ trong vài phút.',
  },
  {
    step: 2,
    Icon: Search,
    title: 'Tìm & ứng tuyển',
    desc: 'Khám phá hàng ngàn vị trí thực tập phù hợp và nộp đơn ngay lập tức.',
  },
  {
    step: 3,
    Icon: CheckCircle2,
    title: 'Nhận phản hồi',
    desc: 'Theo dõi trạng thái ứng tuyển và nhận thông báo phỏng vấn trực tiếp trên nền tảng.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Bắt đầu chỉ trong 3 bước
        </h2>
        <p className="text-gray-500 mb-12 text-sm max-w-xl mx-auto">
          Quy trình đơn giản, nhanh chóng để bạn sớm có được cơ hội thực tập mơ ước
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.step} className="flex flex-col items-center">
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center">
                  <s.Icon className="w-8 h-8 text-emerald-600" />
                </div>
                <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{s.desc}</p>
            </div>
          ))}
        </div>

        <Link
          href="/register?role=STUDENT"
          className="mt-12 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-lg"
        >
          Tạo hồ sơ miễn phí →
        </Link>
      </div>
    </section>
  );
}
