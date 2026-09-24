'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, Clock3, MapPin, Pencil, Plus, Trash2, Users, XCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { ApplicationStatus } from '@/types';
import { Badge, Button } from '@/components/ui';

const statusConfig: Record<ApplicationStatus, { label: string; tone: 'neutral' | 'accent' | 'success' | 'warning' | 'danger'; icon: typeof Clock3 }> = {
  PENDING: { label: 'Chờ xem', tone: 'warning', icon: Clock3 },
  REVIEWED: { label: 'Đã xem', tone: 'accent', icon: CheckCircle2 },
  ACCEPTED: { label: 'Đã nhận', tone: 'success', icon: CheckCircle2 },
  REJECTED: { label: 'Từ chối', tone: 'danger', icon: XCircle },
};

export default function CompanyDashboard() {
  const { currentUser, companyProfile, jobs, applications, updateApplicationStatus, removeJob } = useApp();

  const companyJobs = useMemo(
    () => jobs.filter((job) => job.companyId === companyProfile.id || job.companyId === currentUser?.id || job.companyName === companyProfile.companyName),
    [companyProfile.companyName, companyProfile.id, currentUser?.id, jobs],
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
            <h1>Dashboard doanh nghiệp</h1>
            <p>Vui lòng đăng nhập bằng tài khoản doanh nghiệp để quản lý tin tuyển dụng.</p>
          </section>
        </div>
      </div>
    );
  }

  const handleDelete = (jobId: string, title: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa tin “${title}”?`)) removeJob(jobId);
  };

  return (
    <div className="company-page">
      <div className="im-container">
        <section className="company-page-heading company-page-heading--dashboard">
          <div className="company-heading-icon" aria-hidden="true"><BriefcaseBusiness size={22} /></div>
          <div>
            <p className="company-kicker">Không gian tuyển dụng</p>
            <h1>Xin chào, {companyProfile.companyName || currentUser.name}</h1>
            <p>Theo dõi tin tuyển dụng, chỉ tiêu và ứng viên trên cùng một màn hình.</p>
          </div>
          <div className="company-heading-actions">
            <Link href="/company/profile" className="ui-button ui-button-secondary"><Building2 size={17} /> Hồ sơ công ty</Link>
            <Link href="/company/jobs/create" className="ui-button ui-button-primary"><Plus size={17} /> Đăng tin mới</Link>
          </div>
        </section>

        <section className="company-stats" aria-label="Tổng quan tuyển dụng">
          <div className="company-stat"><span className="company-stat__icon company-stat__icon--blue"><BriefcaseBusiness size={18} /></span><div><strong>{companyJobs.length}</strong><span>Tin đang quản lý</span></div></div>
          <div className="company-stat"><span className="company-stat__icon company-stat__icon--green"><Users size={18} /></span><div><strong>{companyApplications.length}</strong><span>Hồ sơ nhận được</span></div></div>
          <div className="company-stat"><span className="company-stat__icon company-stat__icon--amber"><CheckCircle2 size={18} /></span><div><strong>{totalQuota}</strong><span>Tổng chỉ tiêu</span></div></div>
          <div className="company-stat"><span className="company-stat__icon company-stat__icon--purple"><Clock3 size={18} /></span><div><strong>{companyApplications.filter((application) => application.status === 'PENDING').length}</strong><span>Hồ sơ chờ xử lý</span></div></div>
        </section>

        <div className="company-dashboard-grid">
          <section className="company-panel">
            <div className="company-section-heading">
              <div><h2>Tin tuyển dụng của bạn</h2><p>Chỉnh sửa, xem nhanh hoặc gỡ các tin đã đăng.</p></div>
              <Link href="/company/jobs/create" className="company-inline-link">+ Đăng tin</Link>
            </div>
            <div className="company-job-list">
              {companyJobs.length === 0 ? (
                <div className="ui-state"><BriefcaseBusiness size={28} /><p className="ui-state__title">Chưa có tin tuyển dụng</p><p className="ui-state__description">Bắt đầu bằng cách tạo tin đầu tiên để tiếp cận ứng viên phù hợp.</p><Link href="/company/jobs/create" className="ui-button ui-button-primary">Đăng tin đầu tiên</Link></div>
              ) : companyJobs.map((job) => {
                const jobApplications = companyApplications.filter((application) => application.jobId === job.id).length;
                return (
                  <article className="company-job-card" key={job.id}>
                    <div className="company-job-card__main"><div className="company-job-card__title-row"><h3>{job.title}</h3>{job.isFeatured ? <Badge tone="accent">Nổi bật</Badge> : null}</div><p className="company-job-card__company">{job.industry}</p><div className="company-job-card__meta"><span><MapPin size={15} /> {job.location}</span><span><CalendarDays size={15} /> {job.deadline ? `Hạn ${job.deadline}` : 'Không giới hạn'}</span><span><Users size={15} /> {jobApplications} ứng viên</span></div></div>
                    <div className="company-job-card__side"><Badge tone="success">Đang tuyển</Badge><div className="company-job-card__actions"><Link href={`/company/jobs/${job.id}`} className="ui-button ui-button-sm ui-button-secondary"><Pencil size={15} /> Sửa</Link><Button variant="ghost" size="sm" onClick={() => handleDelete(job.id, job.title)}><Trash2 size={15} /> Xóa</Button></div></div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="company-panel">
            <div className="company-section-heading"><div><h2>Ứng viên mới nhất</h2><p>Xem hồ sơ và cập nhật trạng thái xử lý.</p></div><span className="company-count-label">{companyApplications.length} hồ sơ</span></div>
            <div className="company-candidate-list">
              {companyApplications.length === 0 ? <div className="ui-state"><Users size={28} /><p className="ui-state__title">Chưa có ứng viên</p><p className="ui-state__description">Ứng viên sẽ xuất hiện tại đây sau khi nộp đơn vào tin tuyển dụng của bạn.</p></div> : companyApplications.map((application) => {
                const job = companyJobs.find((item) => item.id === application.jobId);
                const config = statusConfig[application.status];
                const StatusIcon = config.icon;
                return <article className="company-candidate" key={application.id}><div className="company-candidate__avatar">{application.studentName.slice(0, 1)}</div><div className="company-candidate__body"><div className="company-candidate__top"><div><h3>{application.studentName}</h3><p>{job?.title ?? 'Tin tuyển dụng'} · GPA {application.studentGpa.toFixed(1)}</p></div><Badge tone={config.tone}><StatusIcon size={13} /> {config.label}</Badge></div><div className="company-candidate__meta"><span>{application.studentUniversity}</span><span>{application.studentMajor}</span></div><div className="company-candidate__actions"><span className="company-cv-label">{application.cvFileName ?? 'Chưa có CV'}</span><select className="ui-select ui-select--compact" value={application.status} aria-label={`Trạng thái hồ sơ của ${application.studentName}`} onChange={(event) => updateApplicationStatus(application.id, event.target.value as ApplicationStatus)}><option value="PENDING">Chờ xem</option><option value="REVIEWED">Đã xem</option><option value="ACCEPTED">Đã nhận</option><option value="REJECTED">Từ chối</option></select></div></div></article>;
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
