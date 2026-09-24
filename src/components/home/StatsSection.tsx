import { Building2, Users, Briefcase, Star } from 'lucide-react';

const STATS = [
  { value: '2,500+', label: 'Doanh nghiệp', Icon: Building2 },
  { value: '15,000+', label: 'Sinh viên', Icon: Users },
  { value: '8,500+', label: 'Vị trí thực tập', Icon: Briefcase },
  { value: '94%', label: 'Tỷ lệ hài lòng', Icon: Star },
];

export default function StatsSection() {
  return (
    <section
      className="py-16 px-4"
      style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
              <stat.Icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-emerald-100/80 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
