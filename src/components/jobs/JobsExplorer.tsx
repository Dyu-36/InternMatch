"use client";

import { useT } from '@/context/LocaleContext';

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Briefcase, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Job } from "@/types";
import { useApp } from "@/context/AppContext";
import JobCard from "@/components/jobs/JobCard";
import { Button } from "@/components/shadcn/button";
import { Input as ShadcnInput } from "@/components/shadcn/input";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

interface JobsExplorerProps {
  initialFilters: {
    keyword: string;
    location: string;
    jobType: string;
    industry?: string;
  };
}

const jobTypes = [
  "Thực tập Toàn thời gian",
  "Thực tập Bán thời gian",
  "Remote",
] as const;
const industryMatchers: Record<string, (industry: string) => boolean> = {
  "information-technology": (industry) => /công nghệ|information technology|technology|\bit\b/i.test(industry),
  "marketing-communications": (industry) => /marketing|truyền thông|communications/i.test(industry),
  "finance-accounting": (industry) => /tài chính|kế toán|finance|accounting/i.test(industry),
  "design-creative": (industry) => /thiết kế|sáng tạo|design|creative/i.test(industry),
  "business-sales": (industry) => /kinh doanh|bán hàng|business|sales/i.test(industry),
  "human-resources-administration": (industry) => /nhân sự|hành chính|human resources|administration/i.test(industry),
};

function matchesKeyword(job: Job, keyword: string) {
  if (!keyword.trim()) return true;
  const haystack = [job.title, job.companyName, job.industry, job.description, ...job.skills]
    .join(" ")
    .toLowerCase();

  return haystack.includes(keyword.trim().toLowerCase());
}

function JobsExplorerContent({ initialFilters }: JobsExplorerProps) {
  const t = useT();
  const router = useRouter();
  const { jobs } = useApp();
  const [keyword, setKeyword] = useState(initialFilters.keyword);
  const [location, setLocation] = useState(initialFilters.location);
  const [jobType, setJobType] = useState(initialFilters.jobType);
  const [sort, setSort] = useState<"newest" | "salary">("newest");
  const [industry, setIndustry] = useState(initialFilters.industry ?? "");

  const filteredJobs = useMemo(() => {
    const normalizedLocation = location.trim().toLowerCase();
    const nextJobs = jobs.filter((job) => {
      const locationMatches = !normalizedLocation || job.location.toLowerCase().includes(normalizedLocation);
      const typeMatches = !jobType || job.jobType === jobType;
      const industryMatches = !industry || industryMatchers[industry]?.(job.industry) === true;
      return locationMatches && typeMatches && industryMatches && matchesKeyword(job, keyword);
    });

    return [...nextJobs].sort((a, b) => {
      if (sort === "salary") return b.maxSalary - a.maxSalary;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [jobs, keyword, location, jobType, industry, sort]);


  const activeFilterCount = [keyword.trim(), location.trim(), jobType, industry].filter(Boolean).length;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    if (jobType) params.set("type", jobType);
    if (industry) params.set("industry", industry);
    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function clearFilters() {
    setKeyword("");
    setLocation("");
    setJobType("");
    setIndustry("");
    router.push("/jobs");
  }

  return (
    <div className="bg-[var(--background)]">
      <section className="border-b border-[var(--border)] bg-white">
        <div className="im-container py-12 sm:py-16">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--accent-strong)]">{t("Cơ hội dành cho bạn")}</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">{t("Tìm cơ hội thực tập phù hợp")}</h1>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">{t("Khám phá các vị trí đang tuyển và tìm công việc phù hợp với kỹ năng, ngành học và mục tiêu nghề nghiệp của bạn.")}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3 shadow-sm lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(190px,0.9fr)_auto]">
            <div className="flex min-h-12 items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 text-[var(--muted)]">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">{t("Tìm theo vị trí hoặc kỹ năng")}</span>
              <ShadcnInput aria-label={t("Tìm theo vị trí hoặc kỹ năng")} value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={t("Vị trí, công ty hoặc kỹ năng")} className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0" />
            </div>

            <div className="flex min-h-12 items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 text-[var(--muted)]">
              <MapPin size={18} aria-hidden="true" />
              <span className="sr-only">{t("Lọc theo địa điểm")}</span>
              <ShadcnInput aria-label={t("Lọc theo địa điểm")} value={location} onChange={(event) => setLocation(event.target.value)} placeholder={t("Địa điểm")} className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0" />
            </div>

            <div className="flex min-h-12 items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 text-[var(--muted)]">
              <Briefcase size={18} aria-hidden="true" />
              <ShadcnSelect value={jobType} onValueChange={setJobType}>
                <SelectTrigger aria-label={t("Lọc theo hình thức")} className="h-auto min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0">
                  <SelectValue placeholder={t("Tất cả hình thức")} />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => <SelectItem key={type} value={type}>{t(type)}</SelectItem>)}
                </SelectContent>
              </ShadcnSelect>
            </div>

            <Button type="submit" className="min-h-12 bg-emerald-700 px-5 text-white hover:bg-emerald-800"><Search size={17} aria-hidden="true" />{t("Tìm kiếm")}</Button>
          </form>
        </div>
      </section>

      <section className="im-container py-10 sm:py-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2"><SlidersHorizontal size={18} className="text-[var(--accent)]" aria-hidden="true" /><h2 className="text-xl font-extrabold text-[var(--foreground)]">{t("Danh sách việc làm")}</h2></div>
            <p className="mt-1 text-sm text-[var(--muted)]">{filteredJobs.length} {t("vị trí phù hợp")}{activeFilterCount ? <> {t("với bộ lọc hiện tại")}</> : ""}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeFilterCount > 0 && <Button type="button" variant="ghost" size="sm" onClick={clearFilters}><X size={15} aria-hidden="true" />{t("Xóa bộ lọc")}</Button>}
            <div className="flex items-center gap-2 text-sm text-[var(--muted)]"><span>{t("Sắp xếp")}</span><ShadcnSelect value={sort} onValueChange={(value) => setSort(value as "newest" | "salary")}><SelectTrigger aria-label={t("Sắp xếp")} className="h-10 min-w-36 border-[var(--border-strong)] bg-white text-[var(--foreground)]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">{t("Mới nhất")}</SelectItem><SelectItem value="salary">{t("Trợ cấp cao nhất")}</SelectItem></SelectContent></ShadcnSelect></div>
          </div>
        </div>

        {filteredJobs.length > 0 ? <div className="grid min-w-0 gap-5 md:grid-cols-2 lg:grid-cols-3">{filteredJobs.map((job) => <JobCard key={job.id} job={job} />)}</div> : <div className="ui-state"><p className="ui-state__title">{t("Chưa tìm thấy vị trí phù hợp")}</p><p className="ui-state__description">{t("Thử thay đổi từ khóa, địa điểm hoặc hình thức làm việc để xem thêm cơ hội.")}</p><Button type="button" variant="outline" size="sm" onClick={clearFilters}>{t("Xem tất cả việc làm")}</Button></div>}

        <div className="mt-10 rounded-2xl border border-[var(--border)] bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6"><div><h3 className="font-bold text-[var(--foreground)]">{t("Chưa có hồ sơ trên InternMatch?")}</h3><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{t("Tạo hồ sơ miễn phí để sẵn sàng ứng tuyển khi tìm được cơ hội phù hợp.")}</p></div><Button asChild className="mt-4 bg-emerald-700 text-white hover:bg-emerald-800 sm:mt-0"><Link href="/register?role=STUDENT">{t("Tạo hồ sơ")}</Link></Button></div>
      </section>
    </div>
  );
}

export default function JobsExplorer({ initialFilters }: JobsExplorerProps) {
  const searchParams = useSearchParams();
  const urlFilters = {
    keyword: searchParams.get("q") ?? initialFilters.keyword,
    location: searchParams.get("location") ?? initialFilters.location,
    jobType: searchParams.get("type") ?? initialFilters.jobType,
    industry: searchParams.get("industry") ?? "",
  };
  return <JobsExplorerContent key={searchParams.toString()} initialFilters={{ ...initialFilters, ...urlFilters }} />;
}
