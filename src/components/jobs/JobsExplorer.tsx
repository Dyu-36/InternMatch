"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Briefcase, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Job } from "@/types";
import { useApp } from "@/context/AppContext";
import JobCard from "@/components/jobs/JobCard";

interface JobsExplorerProps {
  initialFilters: {
    keyword: string;
    location: string;
    jobType: string;
  };
}

const jobTypes = [
  "Thực tập Toàn thời gian",
  "Thực tập Bán thời gian",
  "Remote",
] as const;

function matchesKeyword(job: Job, keyword: string) {
  if (!keyword.trim()) return true;
  const haystack = [job.title, job.companyName, job.industry, job.description, ...job.skills]
    .join(" ")
    .toLowerCase();

  return haystack.includes(keyword.trim().toLowerCase());
}

export default function JobsExplorer({ initialFilters }: JobsExplorerProps) {
  const router = useRouter();
  const { jobs } = useApp();
  const [keyword, setKeyword] = useState(initialFilters.keyword);
  const [location, setLocation] = useState(initialFilters.location);
  const [jobType, setJobType] = useState(initialFilters.jobType);
  const [sort, setSort] = useState<"newest" | "salary">("newest");

  const filteredJobs = useMemo(() => {
    const normalizedLocation = location.trim().toLowerCase();
    const nextJobs = jobs.filter((job) => {
      const locationMatches = !normalizedLocation || job.location.toLowerCase().includes(normalizedLocation);
      const typeMatches = !jobType || job.jobType === jobType;
      return locationMatches && typeMatches && matchesKeyword(job, keyword);
    });

    return [...nextJobs].sort((a, b) => {
      if (sort === "salary") return b.maxSalary - a.maxSalary;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [jobs, keyword, location, jobType, sort]);

  const activeFilterCount = [keyword.trim(), location.trim(), jobType].filter(Boolean).length;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    if (jobType) params.set("type", jobType);
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function clearFilters() {
    setKeyword("");
    setLocation("");
    setJobType("");
    router.push("/jobs");
  }

  return (
    <div className="bg-[var(--background)]">
      <section className="border-b border-[var(--border)] bg-white">
        <div className="im-container py-12 sm:py-16">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--accent-strong)]">Cơ hội dành cho bạn</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">Tìm cơ hội thực tập phù hợp</h1>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">Khám phá các vị trí đang tuyển và tìm công việc phù hợp với kỹ năng, ngành học và mục tiêu nghề nghiệp của bạn.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3 shadow-sm lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(190px,0.9fr)_auto]">
            <label className="flex min-h-12 items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 text-[var(--muted)]">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">Tìm theo vị trí hoặc kỹ năng</span>
              <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Vị trí, công ty hoặc kỹ năng" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-slate-400" />
            </label>

            <label className="flex min-h-12 items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 text-[var(--muted)]">
              <MapPin size={18} aria-hidden="true" />
              <span className="sr-only">Lọc theo địa điểm</span>
              <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Địa điểm" className="min-w-0 flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-slate-400" />
            </label>

            <label className="flex min-h-12 items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 text-[var(--muted)]">
              <Briefcase size={18} aria-hidden="true" />
              <span className="sr-only">Lọc theo hình thức</span>
              <select value={jobType} onChange={(event) => setJobType(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-[var(--foreground)] outline-none">
                <option value="">Tất cả hình thức</option>
                {jobTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>

            <button type="submit" className="ui-button ui-button-primary min-h-12 px-5"><Search size={17} aria-hidden="true" />Tìm kiếm</button>
          </form>
        </div>
      </section>

      <section className="im-container py-10 sm:py-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2"><SlidersHorizontal size={18} className="text-[var(--accent)]" aria-hidden="true" /><h2 className="text-xl font-extrabold text-[var(--foreground)]">Danh sách việc làm</h2></div>
            <p className="mt-1 text-sm text-[var(--muted)]">{filteredJobs.length} vị trí phù hợp{activeFilterCount ? " với bộ lọc hiện tại" : ""}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeFilterCount > 0 && <button type="button" onClick={clearFilters} className="ui-button ui-button-ghost ui-button-sm"><X size={15} aria-hidden="true" />Xóa bộ lọc</button>}
            <label className="flex items-center gap-2 text-sm text-[var(--muted)]"><span>Sắp xếp</span><select value={sort} onChange={(event) => setSort(event.target.value as "newest" | "salary")} className="ui-select min-w-36 py-2"><option value="newest">Mới nhất</option><option value="salary">Trợ cấp cao nhất</option></select></label>
          </div>
        </div>

        {filteredJobs.length > 0 ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filteredJobs.map((job) => <JobCard key={job.id} job={job} />)}</div> : <div className="ui-state"><p className="ui-state__title">Chưa tìm thấy vị trí phù hợp</p><p className="ui-state__description">Thử thay đổi từ khóa, địa điểm hoặc hình thức làm việc để xem thêm cơ hội.</p><button type="button" onClick={clearFilters} className="ui-button ui-button-secondary ui-button-sm">Xem tất cả việc làm</button></div>}

        <div className="mt-10 rounded-2xl border border-[var(--border)] bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6"><div><h3 className="font-bold text-[var(--foreground)]">Chưa có hồ sơ trên InternMatch?</h3><p className="mt-1 text-sm leading-6 text-[var(--muted)]">Tạo hồ sơ miễn phí để sẵn sàng ứng tuyển khi tìm được cơ hội phù hợp.</p></div><Link href="/register?role=STUDENT" className="ui-button ui-button-primary mt-4 sm:mt-0">Tạo hồ sơ</Link></div>
      </section>
    </div>
  );
}
