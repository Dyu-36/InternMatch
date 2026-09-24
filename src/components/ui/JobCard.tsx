import Link from "next/link";
import { ArrowUpRight, Briefcase, Clock3, MapPin } from "lucide-react";
import type { Job } from "@/types";
import { Badge } from "./Badge";
import { CompanyLogo } from "./CompanyLogo";

export interface JobCardProps {
  job: Job;
  href?: string;
}

const currency = new Intl.NumberFormat("vi-VN");

function formatSalary(min: number, max: number) {
  return `${currency.format(min / 1_000_000)}–${currency.format(max / 1_000_000)} triệu`;
}

export function JobCard({ job, href = `/jobs/${job.id}` }: JobCardProps) {
  return (
    <article className="ui-job-card">
      <div className="ui-job-card__top">
        <div className="ui-job-card__company">
          <CompanyLogo companyName={job.companyName} size={40} />
          <span className="ui-job-card__company-name">{job.companyName}</span>
        </div>
        {job.isHot ? <Badge tone="warning">Đang tuyển gấp</Badge> : null}
      </div>

      <div>
        <Link className="ui-job-card__title" href={href}>
          {job.title}
        </Link>
        <p className="ui-job-card__description">{job.description}</p>
      </div>

      <div className="ui-job-card__meta" aria-label="Thông tin công việc">
        <span className="ui-job-card__meta-item"><MapPin size={15} aria-hidden="true" />{job.location}</span>
        <span className="ui-job-card__meta-item"><Briefcase size={15} aria-hidden="true" />{job.jobType}</span>
        <span className="ui-job-card__meta-item"><Clock3 size={15} aria-hidden="true" />Mới cập nhật</span>
      </div>

      <div className="ui-job-card__skills">
        {job.skills.slice(0, 4).map((skill) => <Badge key={skill} tone="accent">{skill}</Badge>)}
      </div>

      <div className="ui-job-card__footer">
        <span className="ui-job-card__salary">{formatSalary(job.minSalary, job.maxSalary)} / tháng</span>
        <Link className="ui-button ui-button-ghost ui-button-sm" href={href}>
          Xem chi tiết <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
