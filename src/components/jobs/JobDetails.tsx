"use client";

import { useLocale, useT } from '@/context/LocaleContext';

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Banknote, Briefcase, CalendarDays, CheckCircle2, MapPin, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatSalary } from "@/lib/utils";

import { ApplyPanel } from "@/components/jobs/ApplyPanel";

interface JobDetailsProps { jobId: string; }

function DetailRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="flex gap-3"><span className="mt-0.5 text-[var(--accent)]">{icon}</span><div><p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</p><p className="mt-1 text-sm font-semibold text-[var(--foreground)]">{value}</p></div></div>;
}

export default function JobDetails({ jobId }: JobDetailsProps) {
  const t = useT();
  const { locale } = useLocale();
  const { jobs } = useApp();
  const job = jobs.find((item) => item.id === jobId);

  if (!job) return <div className="im-container py-20"><div className="ui-state"><p className="ui-state__title">{t("Không tìm thấy việc làm")}</p><p className="ui-state__description">{t("Tin tuyển dụng này có thể đã được gỡ hoặc đường dẫn không chính xác.")}</p><Link href="/jobs" className="ui-button ui-button-primary ui-button-sm">{t("Quay lại danh sách")}</Link></div></div>;

  return <div className="bg-[var(--background)]"><div className="im-container py-8 sm:py-10"><Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]"><ArrowLeft size={16} aria-hidden="true" />{t("Quay lại danh sách việc làm")}</Link>
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start"><div className="space-y-6"><section className="ui-card p-6 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-4"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-xl font-extrabold text-blue-700">{job.companyInitial || job.companyName.charAt(0).toUpperCase()}</div><div><p className="text-sm font-semibold text-[var(--muted)]">{job.companyName}</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-3xl">{job.title}</h1></div></div>{job.isHot && <span className="ui-badge ui-badge-warning">{t("Đang tuyển gấp")}</span>}</div>
      <div className="mt-7 grid gap-5 border-t border-[var(--border)] pt-6 sm:grid-cols-2"><DetailRow icon={<MapPin size={18} />} label={t("Địa điểm")} value={job.location} /><DetailRow icon={<Briefcase size={18} />} label={t("Hình thức")} value={t(job.jobType)} /><DetailRow icon={<Banknote size={18} />} label={t("Trợ cấp")} value={formatSalary(job.minSalary, job.maxSalary, locale)} /><DetailRow icon={<CalendarDays size={18} />} label={t("Ngày đăng")} value={job.createdAt} /></div><div className="mt-6 flex flex-wrap gap-2">{job.skills.map((skill) => <span key={skill} className="ui-badge ui-badge-accent">{skill}</span>)}</div></section>
      <section className="ui-card space-y-7 p-6 sm:p-8"><div><h2 className="text-lg font-extrabold text-[var(--foreground)]">{t("Mô tả công việc")}</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--muted)]">{job.description}</p></div><div><h2 className="text-lg font-extrabold text-[var(--foreground)]">{t("Yêu cầu ứng viên")}</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--muted)]">{job.requirements}</p></div><div><h2 className="text-lg font-extrabold text-[var(--foreground)]">{t("Quyền lợi & đào tạo")}</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--muted)]">{job.benefits}</p></div></section></div>
      <aside className="space-y-4 lg:sticky lg:top-24"><ApplyPanel job={job} /><section className="ui-card space-y-4 p-6"><h2 className="text-sm font-extrabold uppercase tracking-wide text-[var(--muted)]">{t("Thông tin nhanh")}</h2><DetailRow icon={<Users size={18} />} label={t("Chỉ tiêu")} value={job.quota ? `${job.quota} ${locale === 'en' ? 'openings' : 'vị trí'}` : t("Đang cập nhật")} /><DetailRow icon={<CheckCircle2 size={18} />} label={t("Trạng thái")} value="Đang nhận hồ sơ" /></section></aside>
    </div></div></div>;
}
