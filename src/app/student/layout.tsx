import { redirect } from 'next/navigation';
import { requireAccount } from '@/lib/repository';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const account = await requireAccount().catch(() => null);
  if (!account) redirect('/login');
  if (account.user.role !== 'STUDENT') redirect('/company/dashboard');
  return children;
}
