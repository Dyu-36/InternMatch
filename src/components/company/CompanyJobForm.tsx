'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BriefcaseBusiness, CalendarDays, Megaphone, Save, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import type { Job, JobType } from '@/types';
import { Button, Input } from '@/components/ui';

interface CompanyJobFormProps { jobId?: string; }

type JobFormState = {
  title: string;
  industry: string;
  jobType: JobType;
  location: string;
  minSalary: string;
  maxSalary: string;
  skills: string;
  description: string;
  requirements: string;
  benefits: string;
  quota: string;
  deadline: string;
  isFeatured: boolean;
};

const emptyForm: JobFormState = { title: '', industry: 'Công nghệ thông tin', jobType: 'Thực tập Toàn thời gian', location: '', minSalary: '', maxSalary: '', skills: '', description: '', requirements: '', benefits: '', quota: '1', deadline: '', isFeatured: false };

function toForm(job: Job): JobFormState {
  return { title: job.title, industry: job.industry, jobType: job.jobType, location: job.location, minSalary: String(job.minSalary || ''), maxSalary: String(job.maxSalary || ''), skills: job.skills.join(', '), description: job.description, requirements: job.requirements, benefits: job.benefits, quota: String(job.quota ?? 1), deadline: job.deadline ?? '', isFeatured: Boolean(job.isFeatured) };
}

export default function CompanyJobForm({ jobId }: CompanyJobFormProps) {
  const router = useRouter();
  const { currentUser, companyProfile, jobs, addJob, updateJob } = useApp();
  const existingJob = useMemo(() => (jobId ? jobs.find((job) => job.id === jobId) : undefined), [jobId, jobs]);
  const [form, setForm] = useState<JobFormState>(existingJob ? toForm(existingJob) : emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (existingJob) setForm(toForm(existingJob));
  }, [existingJob]);

  if (!currentUser || currentUser.role !== 'COMPANY') {
    return <div className="company-page"><div className="im-container"><section className="company-guard ui-card"><ShieldCheck size={42} /><h1>Đăng tin tuyển dụng</h1><p>Vui lòng đăng nhập bằng tài khoản doanh nghiệp để tiếp tục.</p></section></div></div>;
  }

  if (jobId && !existingJob) {
    return <div className="company-page"><div className="im-container"><section className="company-guard ui-card"><BriefcaseBusiness size={42} /><h1>Không tìm thấy tin tuyển dụng</h1><p>Tin này có thể đã bị xóa hoặc không thuộc doanh nghiệp của bạn.</p><Link href="/company/dashboard" className="ui-button ui-button-secondary">Quay lại dashboard</Link></section></div></div>;
  }

  const update = (field: keyof JobFormState, value: string | boolean) => { setForm((previous) => ({ ...previous, [field]: value })); setError(''); };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.location.trim() || !form.description.trim() || !form.requirements.trim() || !form.benefits.trim()) { setError('Vui lòng hoàn thiện các trường bắt buộc trước khi xuất bản.'); return; }
    const minSalary = Number(form.minSalary) || 0;
    const maxSalary = Number(form.maxSalary) || minSalary;
    if (maxSalary < minSalary) { setError('Mức trợ cấp tối đa phải lớn hơn hoặc bằng mức tối thiểu.'); return; }
    const payload: Omit<Job, 'id' | 'createdAt'> = { companyId: companyProfile.id, companyName: companyProfile.companyName, companyLogo: companyProfile.logoUrl, companyInitial: (companyProfile.companyName || 'I')[0].toUpperCase(), title: form.title.trim(), industry: form.industry.trim(), jobType: form.jobType, location: form.location.trim(), minSalary, maxSalary, skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean), description: form.description.trim(), requirements: form.requirements.trim(), benefits: form.benefits.trim(), quota: Math.max(1, Number(form.quota) || 1), deadline: form.deadline || undefined, isFeatured: form.isFeatured, isHot: form.isFeatured };
    if (jobId) updateJob(jobId, payload); else addJob(payload);
    router.push('/company/dashboard');
  };

  return <div className="company-page"><div className="im-container"><Link href="/company/dashboard" className="company-back-link"><ArrowLeft size={16} /> Quay lại dashboard</Link><section className="company-page-heading"><div className="company-heading-icon company-heading-icon--purple" aria-hidden="true"><Megaphone size={22} /></div><div><p className="company-kicker">Tin tuyển dụng</p><h1>{jobId ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng mới'}</h1><p>Tạo một tin rõ ràng, đầy đủ để thu hút đúng nhóm thực tập sinh.</p></div></section><form className="company-form-shell" onSubmit={handleSubmit}><section className="company-form-section"><div className="company-section-heading"><div><h2>Thông tin vị trí</h2><p>Các trường có dấu * là bắt buộc.</p></div></div><div className="company-form-grid"><Input label="Tiêu đề tuyển dụng" value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="Ví dụ: Thực tập sinh Frontend Developer" required /><Input label="Ngành nghề" value={form.industry} onChange={(event) => update('industry', event.target.value)} required /><div className="ui-field"><label className="ui-label" htmlFor="job-type">Hình thức làm việc <span className="ui-required">*</span></label><select id="job-type" className="ui-select" value={form.jobType} onChange={(event) => update('jobType', event.target.value as JobType)}><option>Thực tập Toàn thời gian</option><option>Thực tập Bán thời gian</option><option>Full-time</option><option>Part-time</option><option>Remote</option></select></div><Input label="Địa điểm làm việc" value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="Ví dụ: Cầu Giấy, Hà Nội" required /><Input label="Trợ cấp tối thiểu (VNĐ / tháng)" type="number" min="0" value={form.minSalary} onChange={(event) => update('minSalary', event.target.value)} required /><Input label="Trợ cấp tối đa (VNĐ / tháng)" type="number" min="0" value={form.maxSalary} onChange={(event) => update('maxSalary', event.target.value)} required /><Input label="Số lượng tuyển" type="number" min="1" value={form.quota} onChange={(event) => update('quota', event.target.value)} required /><div className="ui-field"><label className="ui-label" htmlFor="job-deadline">Hạn nhận hồ sơ</label><div className="company-input-with-icon"><CalendarDays size={17} /><input id="job-deadline" className="ui-input" type="date" value={form.deadline} onChange={(event) => update('deadline', event.target.value)} /></div></div></div><Input label="Kỹ năng yêu cầu" value={form.skills} onChange={(event) => update('skills', event.target.value)} placeholder="React, TypeScript, Git (phân cách bằng dấu phẩy)" hint="Thêm các kỹ năng quan trọng để ứng viên dễ tìm thấy tin." /></section><section className="company-form-section"><div className="company-section-heading"><div><h2>Mô tả & quyền lợi</h2><p>Viết cụ thể để ứng viên hiểu được công việc và cơ hội phát triển.</p></div></div><div className="company-form-stack"><div className="ui-field"><label className="ui-label" htmlFor="job-description">Mô tả công việc <span className="ui-required">*</span></label><textarea id="job-description" className="ui-textarea company-textarea" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Ứng viên sẽ làm gì trong vai trò này?" required /></div><div className="ui-field"><label className="ui-label" htmlFor="job-requirements">Yêu cầu ứng viên <span className="ui-required">*</span></label><textarea id="job-requirements" className="ui-textarea company-textarea" value={form.requirements} onChange={(event) => update('requirements', event.target.value)} placeholder="Kiến thức, kỹ năng hoặc kinh nghiệm cần có..." required /></div><div className="ui-field"><label className="ui-label" htmlFor="job-benefits">Quyền lợi & đào tạo <span className="ui-required">*</span></label><textarea id="job-benefits" className="ui-textarea company-textarea" value={form.benefits} onChange={(event) => update('benefits', event.target.value)} placeholder="Trợ cấp, mentor, đào tạo, cơ hội trở thành nhân viên chính thức..." required /></div></div></section><section className="company-featured-option"><label className="ui-checkbox"><input className="ui-checkbox__control" type="checkbox" checked={form.isFeatured} onChange={(event) => update('isFeatured', event.target.checked)} /><span className="ui-checkbox__label">Đánh dấu tin nổi bật<span className="ui-checkbox__description">Tin nổi bật được ưu tiên hiển thị ở khu vực gợi ý trong bản demo.</span></span></label></section>{error ? <p className="ui-error" role="alert">{error}</p> : null}<div className="company-form-actions"><Link href="/company/dashboard" className="ui-button ui-button-secondary">Hủy</Link><Button type="submit"><Save size={17} /> {jobId ? 'Lưu thay đổi' : 'Xuất bản tin'}</Button></div></form></div></div>;
}
