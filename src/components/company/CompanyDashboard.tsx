'use client';

import { useT } from '@/context/LocaleContext';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, Clock3, MapPin, Pencil, Plus, Trash2, Users, XCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { ApplicationStatus } from '@/types';
import { Badge, Button } from '@/components/ui';

import { ResumeLink } from '@/components/ResumeLink';

const statusConfig: Record<ApplicationStatus, { label: string; tone: 'neutral' | 'accent' | 'success' | 'warning' | 'danger'; icon: typeof Clock3 }> = {
  PENDING: { label: 'Chờ xem', tone: 'warning', icon: Clock3 },
  REVIEWED: { label: 'Đã xem', tone: 'accent', icon: CheckCircle2 },
  ACCEPTED: { label: 'Đã nhận', tone: 'success', icon: CheckCircle2 },
  REJECTED: { label: 'Từ chối', tone: 'danger', icon: XCircle },
};

export default function CompanyDashboard() {
  const t = useT();
  const { currentUser, companyProfile, jobs, applications, updateApplicationStatus, removeJob } = useApp();

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const run = async (action: () => Promise<void>) => { setError(''); setBusy(true); try { await action(); } catch (e) { setError(e instanceof Error ? e.message : 'Không thể lưu thay đổi.'); } finally { setBusy(false); } };

  const companyJobs = useMemo(
    () => jobs.filter((job) => job.companyId === currentUser?.id),
    [currentUser?.id, jobs],
  );
  const companyJobIds = useMemo(() => new Set(companyJobs.map((job) => job.id)), [companyJobs]);
  const companyApplications = useMemo(() => applications.filter((application) => companyJobIds.has(application.jobId)), [applications, companyJobIds]);
  const totalQuota = companyJobs.reduce((total, job) => total + (job.quota ?? 0), 0);

  if (!currentUser || currentUser.role !== 'COMPANY') {
    return (
      <div className="company-page">
        <div className="im-container">
          <section className="company-guard ui-card">
            <Building2 size={42} aria-hidden="true" />
            <h1>{t("Dashboard doanh nghiệp")}</h1>
            <p>{t("Vui lòng đăng nhập bằng tài khoản doanh nghiệp để quản lý tin tuyển dụng.")}</p>
          </section>
        </div>
      </div>
    );
  }

  const handleDelete = (jobId: string, title: string) => {
    if (window.confirm(`${t('Xóa tin tuyển dụng')} “${title}”?`)) void run(() => removeJob(jobId));
  };

  return (
    <div className="company-page">
      <div className="im-container">
        <section className="company-page-heading company-page-heading--dashboard">
          <div className="company-heading-icon" aria-hidden="true"><BriefcaseBusiness size={22} /></div>
          <div>
            <p className="company-kicker">{t("Không gian tuyển dụng")}</p>
            <h1>{t("Xin chào,")} {companyProfile.companyName || currentUser.name}</h1>
            <p>{t("Theo dõi tin tuyển dụng, chỉ tiêu và ứng viên trên cùng một màn hình.")}</p>
          </div>
          <div className="company-heading-actions">
            <Link href="/company/profile" className="ui-button ui-button-secondary"><Building2 size={17} /> {t("Hồ sơ công ty")}</Link>
            <Link href="/company/jobs/create" className="ui-button ui-button-primary"><Plus size={17} /> {t("Đăng tin mới")}</Link>
          </div>
        </section>

        {error && <p className="ui-error" role="alert">{t(error)}</p>}
        <section className="company-stats" aria-label={t("Tổng quan tuyển dụng")}>
          <div className="company-stat"><span className="company-stat__icon company-stat__icon--blue"><BriefcaseBusiness size={18} /></span><div><strong>{companyJobs.length}</strong><span>{t("Tin đang quản lý")}</span></div></div>
          <div className="company-stat"><span className="company-stat__icon company-stat__icon--green"><Users size={18} /></span><div><strong>{companyApplications.length}</strong><span>{t("Hồ sơ nhận được")}</span></div></div>
          <div className="company-stat"><span className="company-stat__icon company-stat__icon--amber"><CheckCircle2 size={18} /></span><div><strong>{totalQuota}</strong><span>{t("Tổng chỉ tiêu")}</span></div></div>
          <div className="company-stat"><span className="company-stat__icon company-stat__icon--purple"><Clock3 size={18} /></span><div><strong>{companyApplications.filter((application) => application.status === 'PENDING').length}</strong><span>{t("Hồ sơ chờ xử lý")}</span></div></div>
        </section>

        <div className="company-dashboard-grid">
          <section className="company-panel">
            <div className="company-section-heading">
              <div><h2>{t("Tin tuyển dụng của bạn")}</h2><p>{t("Chỉnh sửa, xem nhanh hoặc gỡ các tin đã đăng.")}</p></div>
              <Link href="/company/jobs/create" className="company-inline-link">{t("+ Đăng tin")}</Link>
            </div>
            <div className="company-job-list">
              {companyJobs.length === 0 ? (
                <div className="ui-state"><BriefcaseBusiness size={28} /><p className="ui-state__title">{t("Chưa có tin tuyển dụng")}</p><p className="ui-state__description">{t("Bắt đầu bằng cách tạo tin đầu tiên để tiếp cận ứng viên phù hợp.")}</p><Link href="/company/jobs/create" className="ui-button ui-button-primary">{t("Đăng tin đầu tiên")}</Link></div>
              ) : companyJobs.map((job) => {
                const jobApplications = companyApplications.filter((application) => application.jobId === job.id).length;
                return (
                  <article className="company-job-card" key={job.id}>
                    <div className="company-job-card__main"><div className="company-job-card__title-row"><h3>{job.title}</h3>{job.isFeatured ? <Badge tone="accent">{t("Nổi bật")}</Badge> : null}</div><p className="company-job-card__company">{job.industry}</p><div className="company-job-card__meta"><span><MapPin size={15} /> {job.location}</span><span><CalendarDays size={15} /> {job.deadline ? `${t('Hạn nhận hồ sơ')}: ${job.deadline}` : t("Không giới hạn")}</span><span><Users size={15} /> {jobApplications} {t("ứng viên")}</span></div></div>
                    <div className="company-job-card__side"><Badge tone="success">{t("Đang tuyển")}</Badge><div className="company-job-card__actions"><Link href={`/company/jobs/${job.id}`} className="ui-button ui-button-sm ui-button-secondary"><Pencil size={15} /> {t("Sửa")}</Link><Button variant="ghost" size="sm" disabled={busy} onClick={() => handleDelete(job.id, job.title)}><Trash2 size={15} /> {t("Xóa")}</Button></div></div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="company-panel">
            <div className="company-section-heading"><div><h2>{t("Ứng viên mới nhất")}</h2><p>{t("Xem hồ sơ và cập nhật trạng thái xử lý.")}</p></div><span className="company-count-label">{companyApplications.length} {t("hồ sơ")}</span></div>
            <div className="company-candidate-list">
              {companyApplications.length === 0 ? <div className="ui-state"><Users size={28} /><p className="ui-state__title">{t("Chưa có ứng viên")}</p><p className="ui-state__description">{t("Ứng viên sẽ xuất hiện tại đây sau khi nộp đơn vào tin tuyển dụng của bạn.")}</p></div> : companyApplications.map((application) => {
                const job = companyJobs.find((item) => item.id === application.jobId);
                const config = statusConfig[application.status];
                const StatusIcon = config.icon;
                return <article className="company-candidate" key={application.id}><div className="company-candidate__avatar">{application.studentName.slice(0, 1)}</div><div className="company-candidate__body"><div className="company-candidate__top"><div><h3>{application.studentName}</h3><p>{job?.title ?? t("Tin tuyển dụng")} · GPA {application.studentGpa.toFixed(1)}</p></div><Badge tone={config.tone}><StatusIcon size={13} /> {t(config.label)}</Badge></div><div className="company-candidate__meta"><span>{application.studentUniversity}</span><span>{application.studentMajor}</span></div><p className="ui-hint">{application.studentSkills.join(', ')}</p>{application.coverLetter && <p>{application.coverLetter}</p>}<div className="company-candidate__actions"><span className="company-cv-label"><ResumeLink path={application.cvUrl} name={application.cvFileName} /></span><select className="ui-select ui-select--compact" value={application.status} aria-label={`${t('Trạng thái hồ sơ của')} ${application.studentName}`} disabled={busy} onChange={(event) => void run(() => updateApplicationStatus(application.id, event.target.value as ApplicationStatus))}><option value="PENDING">{t("Chờ xem")}</option><option value="REVIEWED">{t("Đã xem")}</option><option value="ACCEPTED">{t("Đã nhận")}</option><option value="REJECTED">{t("Từ chối")}</option></select></div></div></article>;
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
