'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, GraduationCap, Sparkles, UserRound, XCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import JobCard from '@/components/jobs/JobCard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ApplicationStatus, Job } from '@/types';

function getMatchScore(job: Job, skills: string[]) {
  if (!skills.length || !job.skills.length) return 0;
  const normalizedSkills = new Set(skills.map((skill) => skill.trim().toLowerCase()).filter(Boolean));
  const matchedSkills = job.skills.filter((skill) => normalizedSkills.has(skill.toLowerCase()));
  return Math.round((matchedSkills.length / job.skills.length) * 100);
}

const statusLabels: Record<ApplicationStatus, string> = {
  PENDING: 'Chờ duyệt',
  REVIEWED: 'Đã xem',
  ACCEPTED: 'Đã duyệt',
  REJECTED: 'Từ chối',
};

const statusIcons: Record<ApplicationStatus, typeof Clock3> = {
  PENDING: Clock3,
  REVIEWED: Clock3,
  ACCEPTED: CheckCircle2,
  REJECTED: XCircle,
};

const statusTones: Record<ApplicationStatus, 'warning' | 'accent' | 'success' | 'danger'> = {
  PENDING: 'warning',
  REVIEWED: 'accent',
  ACCEPTED: 'success',
  REJECTED: 'danger',
};

export default function StudentDashboard() {
  const { currentUser, studentProfile, jobs, applications } = useApp();

  const applicationRows = useMemo(() => applications.filter((application) => application.studentId === currentUser?.id), [applications, currentUser?.id]);
  const recommendedJobs = useMemo(
    () => jobs
      .map((job) => ({ job, score: getMatchScore(job, studentProfile.skills) }))
      .sort((left, right) => right.score - left.score || right.job.createdAt.localeCompare(left.job.createdAt))
      .slice(0, 4),
    [jobs, studentProfile.skills],
  );
  const appliedJobIds = new Set(applicationRows.map((application) => application.jobId));
  const profileFields = [studentProfile.fullName, studentProfile.university, studentProfile.major, studentProfile.skills.length ? 'skills' : '', studentProfile.goals, studentProfile.cvFileName];
  const completion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  if (!currentUser) {
    return (
      <main className="student-page">
        <Container>
          <div className="student-guard ui-card">
            <UserRound size={28} aria-hidden="true" />
            <h1>Đăng nhập để xem dashboard</h1>
            <p>Theo dõi đơn ứng tuyển và nhận gợi ý việc làm theo kỹ năng của bạn.</p>
            <Link className="ui-button ui-button-primary" href="/login?next=/student/dashboard">Đăng nhập</Link>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="student-page">
      <Container>
        <section className="student-summary ui-card">
          <div className="student-summary__identity">
            <Avatar name={studentProfile.fullName || currentUser.name} src={studentProfile.avatarUrl} size={64} />
            <div>
              <p className="student-kicker">Dashboard thực tập sinh</p>
              <h1>{studentProfile.fullName || currentUser.name}</h1>
              <p className="student-summary__meta"><GraduationCap size={17} aria-hidden="true" /> {studentProfile.university} · {studentProfile.major} · Khóa {studentProfile.expectedGraduationYear}</p>
            </div>
          </div>
          <Link className="ui-button ui-button-secondary" href="/student/profile"><UserRound size={17} aria-hidden="true" /> Chỉnh sửa hồ sơ &amp; CV</Link>
          <div className="student-summary__skills">
            <strong>Kỹ năng hiện tại của bạn:</strong>
            <div className="student-skill-list">{studentProfile.skills.length ? studentProfile.skills.map((skill) => <Badge tone="accent" key={skill}>{skill}</Badge>) : <span className="ui-hint">Chưa cập nhật kỹ năng</span>}</div>
          </div>
          <div className="student-progress" aria-label={`Hồ sơ hoàn thiện ${completion}%`}>
            <div className="student-progress__label"><span>Mức độ hoàn thiện hồ sơ</span><strong>{completion}%</strong></div>
            <div className="student-progress__track"><span style={{ width: `${completion}%` }} /></div>
          </div>
        </section>

        <div className="student-dashboard-grid">
          <section className="student-panel ui-card">
            <div className="student-panel__header">
              <div><h2><Clock3 size={24} aria-hidden="true" /> Lịch sử đơn đã ứng tuyển</h2><p>Theo dõi các vị trí bạn đã quan tâm.</p></div>
              <Badge tone="accent">{applicationRows.length}</Badge>
            </div>
            {applicationRows.length === 0 ? (
              <EmptyState title="Bạn chưa nộp hồ sơ vào vị trí thực tập nào." description="Khám phá các cơ hội phù hợp với kỹ năng của bạn ngay hôm nay." action={<Link className="ui-button ui-button-secondary" href="/jobs">Khám phá việc làm <ArrowRight size={16} aria-hidden="true" /></Link>} />
            ) : (
              <div className="student-application-list">
                {applicationRows.map((application) => {
                  const job = jobs.find((item) => item.id === application.jobId);
                  const StatusIcon = statusIcons[application.status];
                  return <div className="student-application" key={application.id}>
                    <div><Link href={`/jobs/${application.jobId}`} className="student-application__title">{job?.title ?? 'Vị trí thực tập'}</Link><p>{job?.companyName ?? 'Doanh nghiệp'} · Nộp ngày {application.appliedAt}</p></div>
                    <Badge tone={statusTones[application.status]}><StatusIcon size={14} aria-hidden="true" /> {statusLabels[application.status]}</Badge>
                  </div>;
                })}
              </div>
            )}
          </section>

          <section className="student-panel ui-card">
            <div className="student-panel__header">
              <div><h2><Sparkles size={24} aria-hidden="true" /> Gợi ý việc làm phù hợp</h2><p>Các cơ hội thực tập có yêu cầu kỹ năng tương đồng với hồ sơ của bạn.</p></div>
              <Badge tone="success">Matching mock</Badge>
            </div>
            <div className="student-recommendations">
              {recommendedJobs.map(({ job, score }) => <div className="student-recommendation" key={job.id}><JobCard job={job} matchScore={score} /><div className="student-recommendation__action">{appliedJobIds.has(job.id) ? <span className="student-applied"><CheckCircle2 size={15} aria-hidden="true" /> Đã ứng tuyển</span> : <Link href={`/jobs/${job.id}`} className="student-view-link">Xem &amp; ứng tuyển <ArrowRight size={15} aria-hidden="true" /></Link>}</div></div>)}
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
