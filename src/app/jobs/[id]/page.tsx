import type { Metadata } from "next";
import JobDetails from "@/components/jobs/JobDetails";

export const metadata: Metadata = {
  title: "Chi tiết việc làm",
  description: "Xem thông tin chi tiết về cơ hội thực tập trên InternMatch.",
};

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  return <JobDetails jobId={id} />;
}
