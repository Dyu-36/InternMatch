import CompanyJobForm from '@/components/company/CompanyJobForm';

export default async function CompanyEditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CompanyJobForm jobId={id} />;
}
