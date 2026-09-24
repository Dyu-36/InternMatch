import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { emptyCompany, emptyStudent } from '@/lib/defaults';
import { mapUser, mapStudent, mapCompany, mapJob, mapApplication } from '@/lib/mappers';
import type { Role } from '@/types';

function isSchemaCacheError(error: { code?: string } | null | undefined) {
  return error?.code === 'PGRST205';
}

export async function requireAccount(role?: Role) {
  const client = await createClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) throw new Error('Vui lòng đăng nhập để tiếp tục.');
  const profile = await client.from('profiles').select('*').eq('id', user.id).single();
  if (isSchemaCacheError(profile.error)) {
    const metadata = user.user_metadata as { username?: string; role?: Role };
    if (!metadata.username || !metadata.role) throw new Error('Hồ sơ tài khoản chưa sẵn sàng. Vui lòng thử lại sau.');
    if (role && metadata.role !== role) throw new Error('Bạn không có quyền thực hiện thao tác này.');
    return { client, user: { id: user.id, username: metadata.username, email: user.email ?? '', role: metadata.role, name: metadata.username, avatarUrl: undefined } };
  }
  if (profile.error || !profile.data || (role && profile.data.role !== role)) throw new Error('Bạn không có quyền thực hiện thao tác này.');
  return { client, user: mapUser(profile.data) };
}

export async function readAppState() {
  const client = await createClient();
  const jobResult = await client.from('jobs').select('*').order('created_at', { ascending: false }).order('id');
  // Keep public pages available during a brief PostgREST schema-cache lag.
  // The database remains the source of truth; mutations still surface real errors.
  if (jobResult.error && jobResult.error.code !== 'PGRST205') throw jobResult.error;
  const base = { currentUser: null, studentProfile: emptyStudent, companyProfile: emptyCompany,
    jobs: (jobResult.data ?? []).map(mapJob), applications: [] };
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return base;
  const profile = await client.from('profiles').select('*').eq('id', user.id).single();
  if (isSchemaCacheError(profile.error)) {
    const metadata = user.user_metadata as { username?: string; role?: Role };
    if (!metadata.username || !metadata.role) return base;
    const account = { id: user.id, username: metadata.username, email: user.email ?? '', role: metadata.role, name: metadata.username, avatarUrl: undefined };
    return { ...base, currentUser: account };
  }
  if (profile.error) throw profile.error;
  const account = mapUser(profile.data);
  const [student, company, applications] = await Promise.all([
    account.role === 'STUDENT' ? client.from('student_profiles').select('*').eq('user_id', user.id).single() : null,
    account.role === 'COMPANY' ? client.from('company_profiles').select('*').eq('user_id', user.id).single() : null,
    client.from('applications').select('*').order('applied_at', { ascending: false }),
  ]);
  if (student?.error || company?.error || applications.error) throw student?.error ?? company?.error ?? applications.error;
  return { ...base, currentUser: account,
    studentProfile: student?.data ? mapStudent(student.data, emptyStudent, user.id) : emptyStudent,
    companyProfile: company?.data ? mapCompany(company.data, emptyCompany, user.id) : emptyCompany,
    applications: (applications.data ?? []).map(mapApplication) };
}
