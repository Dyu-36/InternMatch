import { redirect } from 'next/navigation';
import { requireAccount } from '@/lib/repository';

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  const account = await requireAccount().catch(() => null);
  if (!account) redirect('/login?next=/company/dashboard');
  if (account.user.role !== 'COMPANY') redirect('/student/dashboard');
  return children;
}
