import type { Metadata } from "next";
import { cookies } from "next/headers";
import JobsExplorer from "@/components/jobs/JobsExplorer";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await cookies()).get('internmatch_locale')?.value === 'en' ? 'en' : 'vi';
  return locale === 'en'
    ? {
        title: 'Internship jobs',
        description: 'Find internship opportunities that match your skills and career goals.',
      }
    : {
        title: 'Việc làm thực tập',
        description: 'Tìm kiếm cơ hội thực tập phù hợp với kỹ năng và định hướng của bạn.',
      };
}

type SearchValue = string | string[] | undefined;

type JobsPageProps = {
  searchParams: Promise<{
    q?: SearchValue;
    location?: SearchValue;
    type?: SearchValue;
  }>;
};

function firstValue(value: SearchValue) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;

  return (
    <JobsExplorer
      initialFilters={{
        keyword: firstValue(params.q),
        location: firstValue(params.location),
        jobType: firstValue(params.type),
      }}
    />
  );
}
