import type { Metadata } from "next";
import { cookies } from "next/headers";
import JobDetails from "@/components/jobs/JobDetails";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await cookies()).get('internmatch_locale')?.value === 'en' ? 'en' : 'vi';
  return locale === 'en'
    ? {
        title: 'Internship details',
        description: 'View details about an internship opportunity on InternMatch.',
      }
    : {
        title: 'Chi tiết việc làm',
        description: 'Xem thông tin chi tiết về cơ hội thực tập trên InternMatch.',
      };
}

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  return <JobDetails jobId={id} />;
}
