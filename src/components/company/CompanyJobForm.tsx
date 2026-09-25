'use client';

import { useT } from '@/context/LocaleContext';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BriefcaseBusiness, CalendarDays, Loader2, Megaphone, Save, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import type { Job, JobType } from '@/types';
import { Button } from '@/components/shadcn/button';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Textarea } from '@/components/shadcn/textarea';

interface CompanyJobFormProps { jobId?: string; }
type JobFormState = { title: string; industry: string; jobType: JobType; location: string; minSalary: string; maxSalary: string; skills: string; description: string; requirements: string; benefits: string; quota: string; deadline: string; isFeatured: boolean; };
const emptyForm: JobFormState = { title: '', industry: 'Công nghệ thông tin', jobType: 'Thực tập Toàn thời gian', location: '', minSalary: '', maxSalary: '', skills: '', description: '', requirements: '', benefits: '', quota: '1', deadline: '', isFeatured: false };
function toForm(job: Job): JobFormState { return { title: job.title, industry: job.industry, jobType: job.jobType, location: job.location, minSalary: String(job.minSalary || ''), maxSalary: String(job.maxSalary || ''), skills: job.skills.join(', '), description: job.description, requirements: job.requirements, benefits: job.benefits, quota: String(job.quota ?? 1), deadline: job.deadline ?? '', isFeatured: Boolean(job.isFeatured) }; }

export default function CompanyJobForm({ jobId }: CompanyJobFormProps) {
  const t = useT();
  const router = useRouter();
  const { currentUser, companyProfile, jobs, addJob, updateJob } = useApp();
  const existingJob = useMemo(() => (jobId ? jobs.find((job) => job.id === jobId && job.companyId === currentUser?.id) : undefined), [jobId, jobs, currentUser?.id]);
  const [form, setForm] = useState<JobFormState>(existingJob ? toForm(existingJob) : emptyForm);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (existingJob) setForm(toForm(existingJob)); }, [existingJob]);

  if (!currentUser || currentUser.role !== 'COMPANY') return <div className="company-page"><div className="im-container"><section className="company-guard ui-card"><ShieldCheck size={42} /><h1>{t("Đăng tin tuyển dụng")}</h1><p>{t("Vui lòng đăng nhập bằng tài khoản doanh nghiệp để tiếp tục.")}</p></section></div></div>;
  if (jobId && !existingJob) return <div className="company-page"><div className="im-container"><section className="company-guard ui-card"><BriefcaseBusiness size={42} /><h1>{t("Không tìm thấy tin tuyển dụng")}</h1><p>{t("Tin này có thể đã bị xóa hoặc không thuộc doanh nghiệp của bạn.")}</p><Link href="/company/dashboard" className="ui-button ui-button-secondary">{t("Quay lại dashboard")}</Link></section></div></div>;

  const update = (field: keyof JobFormState, value: string | boolean) => { setForm((previous) => ({ ...previous, [field]: value })); setError(''); };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.location.trim() || !form.description.trim() || !form.requirements.trim() || !form.benefits.trim()) { setError('Vui lòng hoàn thiện các trường bắt buộc trước khi xuất bản.'); return; }
    const minSalary = Number(form.minSalary) || 0;
    const maxSalary = Number(form.maxSalary) || minSalary;
    if (maxSalary < minSalary) { setError('Mức trợ cấp tối đa phải lớn hơn hoặc bằng mức tối thiểu.'); return; }
    const payload: Omit<Job, 'id' | 'createdAt'> = { companyId: companyProfile.id, companyName: companyProfile.companyName, companyLogo: companyProfile.logoUrl, companyInitial: (companyProfile.companyName || 'I')[0].toUpperCase(), title: form.title.trim(), industry: form.industry.trim(), jobType: form.jobType, location: form.location.trim(), minSalary, maxSalary, skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean), description: form.description.trim(), requirements: form.requirements.trim(), benefits: form.benefits.trim(), quota: Math.max(1, Number(form.quota) || 1), deadline: form.deadline || undefined, isFeatured: form.isFeatured, isHot: form.isFeatured };
    setBusy(true);
    try { if (jobId) await updateJob(jobId, payload); else await addJob(payload); router.push('/company/dashboard'); }
    catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'Không thể lưu tin tuyển dụng.'); } finally { setBusy(false); }
  };
  return <div className="company-page"><div className="im-container"><Link href="/company/dashboard" className="company-back-link"><ArrowLeft size={16} /> {t("Quay lại dashboard")}</Link><section className="company-page-heading"><div className="company-heading-icon company-heading-icon--purple" aria-hidden="true"><Megaphone size={22} /></div><div><p className="company-kicker">{t("Tin tuyển dụng")}</p><h1>{jobId ? t("Chỉnh sửa tin tuyển dụng") : t("Đăng tin tuyển dụng mới")}</h1><p>{t("Tạo một tin rõ ràng, đầy đủ để thu hút đúng nhóm thực tập sinh.")}</p></div></section><form className="company-form-shell" onSubmit={handleSubmit}>
<section className="company-form-section"><div className="company-section-heading"><div><h2>{t("Thông tin vị trí")}</h2><p>{t("Các trường có dấu * là bắt buộc.")}</p></div></div><div className="company-form-grid">
  <div className="grid gap-2"><Label htmlFor="job-title">{t("Tiêu đề tuyển dụng")}</Label><Input id="job-title" value={form.title} onChange={(event) => update('title', event.target.value)} placeholder={t("Ví dụ: Thực tập sinh Frontend Developer")} required /></div>
  <div className="grid gap-2"><Label htmlFor="job-industry">{t("Ngành nghề")}</Label><Input id="job-industry" value={form.industry} onChange={(event) => update('industry', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="job-type">{t("Hình thức làm việc")}</Label><Select value={form.jobType} onValueChange={(value) => update('jobType', value as JobType)}><SelectTrigger id="job-type" className="w-full"><SelectValue placeholder={t("Chọn hình thức")}/></SelectTrigger><SelectContent><SelectItem value="Thực tập Toàn thời gian">{t("Thực tập Toàn thời gian")}</SelectItem><SelectItem value="Thực tập Bán thời gian">{t("Thực tập Bán thời gian")}</SelectItem><SelectItem value="Full-time">Full-time</SelectItem><SelectItem value="Part-time">Part-time</SelectItem><SelectItem value="Remote">Remote</SelectItem></SelectContent></Select></div>
  <div className="grid gap-2"><Label htmlFor="job-location">{t("Địa điểm làm việc")}</Label><Input id="job-location" value={form.location} onChange={(event) => update('location', event.target.value)} placeholder={t("Ví dụ: Cầu Giấy, Hà Nội")} required /></div>
  <div className="grid gap-2"><Label htmlFor="job-min-salary">{t("Trợ cấp tối thiểu (VNĐ / tháng)")}</Label><Input id="job-min-salary" type="number" min="0" value={form.minSalary} onChange={(event) => update('minSalary', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="job-max-salary">{t("Trợ cấp tối đa (VNĐ / tháng)")}</Label><Input id="job-max-salary" type="number" min="0" value={form.maxSalary} onChange={(event) => update('maxSalary', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="job-quota">{t("Số lượng tuyển")}</Label><Input id="job-quota" type="number" min="1" value={form.quota} onChange={(event) => update('quota', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="job-deadline">{t("Hạn nhận hồ sơ")}</Label><div className="company-input-with-icon"><CalendarDays size={17} aria-hidden="true" /><Input id="job-deadline" className="border-0 shadow-none focus-visible:ring-0" type="date" value={form.deadline} onChange={(event) => update('deadline', event.target.value)} /></div></div>
</div><div className="mt-4 grid gap-2"><Label htmlFor="job-skills">{t("Kỹ năng yêu cầu")}</Label><Input id="job-skills" value={form.skills} onChange={(event) => update('skills', event.target.value)} placeholder={t("React, TypeScript, Git (phân cách bằng dấu phẩy)")} /><p className="text-xs text-muted-foreground">{t("Thêm các kỹ năng quan trọng để ứng viên dễ tìm thấy tin.")}</p></div></section>
<section className="company-form-section"><div className="company-section-heading"><div><h2>{t("Mô tả & quyền lợi")}</h2><p>{t("Viết cụ thể để ứng viên hiểu được công việc và cơ hội phát triển.")}</p></div></div><div className="company-form-stack">
  <div className="grid gap-2"><Label htmlFor="job-description">{t("Mô tả công việc")}</Label><Textarea id="job-description" className="company-textarea" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder={t("Ứng viên sẽ làm gì trong vai trò này?")} required /></div>
  <div className="grid gap-2"><Label htmlFor="job-requirements">{t("Yêu cầu ứng viên")}</Label><Textarea id="job-requirements" className="company-textarea" value={form.requirements} onChange={(event) => update('requirements', event.target.value)} placeholder={t("Kiến thức, kỹ năng hoặc kinh nghiệm cần có...")} required /></div>
  <div className="grid gap-2"><Label htmlFor="job-benefits">{t("Quyền lợi & đào tạo")}</Label><Textarea id="job-benefits" className="company-textarea" value={form.benefits} onChange={(event) => update('benefits', event.target.value)} placeholder={t("Trợ cấp, mentor, đào tạo, cơ hội trở thành nhân viên chính thức...")} required /></div>
</div></section><section className="company-featured-option"><div className="flex items-start gap-3"><Checkbox id="job-featured" checked={form.isFeatured} onCheckedChange={(checked) => update('isFeatured', checked === true)} /><div className="grid gap-1"><Label htmlFor="job-featured">{t("Đánh dấu tin nổi bật")}</Label><p className="text-xs text-muted-foreground">{t("Tin nổi bật được hiển thị trên trang chủ.")}</p></div></div></section>{error ? <p className="ui-error" role="alert">{t(error)}</p> : null}<div className="company-form-actions"><Link href="/company/dashboard" className="ui-button ui-button-secondary">{t("Hủy")}</Link><Button type="submit" disabled={busy}>{busy ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t("Đang lưu…")}</> : <><Save size={17} aria-hidden="true" /> {jobId ? t("Lưu thay đổi") : t("Xuất bản tin")}</>}</Button></div></form></div></div>;
}
