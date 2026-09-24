'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireAccount, readAppState } from '@/lib/repository';
import { credentialsSchema, roleSchema, studentSchema, companySchema, jobSchema } from '@/lib/validation';
import { jobPayload } from '@/lib/mappers';
import { authEmail } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

async function result<T>(operation: () => Promise<T>) {
  try { return { data: await operation(), error: null }; }
  catch (error) {
    if (error instanceof z.ZodError) return { data: null, error: error.issues[0]?.message ?? 'Thông tin không hợp lệ.' };
    const failure = error as { code?: string; message?: string };
    const messages: Record<string, string> = {
      invalid_credentials: 'Tên đăng nhập hoặc mật khẩu không đúng.',
      user_already_exists: 'Tên đăng nhập đã tồn tại.',
      email_exists: 'Tên đăng nhập đã tồn tại.',
      '23505': 'Thông tin này đã tồn tại hoặc bạn đã ứng tuyển vào vị trí này.',
      '42501': 'Bạn không có quyền thực hiện thao tác này.',
      over_request_rate_limit: 'Bạn thao tác quá nhanh. Vui lòng thử lại sau.',
      over_email_send_rate_limit: 'Vui lòng thử đăng ký lại sau.',
    };
    return { data: null, error: messages[failure.code ?? ''] ?? (error instanceof Error ? error.message : 'Không thể lưu dữ liệu. Vui lòng thử lại.') };
  }
}

export async function getAppState() { return result(readAppState); }

export async function signIn(input: unknown) {
  return result(async () => {
    const { username, password } = credentialsSchema.parse(input);
    const client = await createClient();
    const { error } = await client.auth.signInWithPassword({ email: authEmail(username), password });
    if (error) throw error;
    return true;
  });
}

export async function signUp(input: unknown, roleInput: unknown) {
  return result(async () => {
    const { username, password } = credentialsSchema.parse(input);
    const role = roleSchema.parse(roleInput);
    const email = authEmail(username);
    const admin = createAdminClient();
    if (admin) {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username, role },
      });
      if (error) throw error;
      if (!data.user) throw new Error('Không thể hoàn tất đăng ký. Vui lòng thử lại.');
      const client = await createClient();
      const { error: signInError } = await client.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      return true;
    }
    const client = await createClient();
    const { data, error } = await client.auth.signUp({ email, password,
      options: { data: { username, role } } });
    if (error) throw error;
    if (!data.session) throw new Error('Không thể hoàn tất đăng ký. Vui lòng liên hệ hỗ trợ.');
    return true;
  });
}

export async function signOut() {
  return result(async () => {
    const client = await createClient();
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (error) throw error;
    return true;
  });
}

export async function saveStudent(input: unknown, uploads: FormData) {
  return result(async () => {
    const { client, user } = await requireAccount('STUDENT');
    const value = studentSchema.parse(input);
    const files = await uploadFiles(client, user.id, uploads, ['avatar', 'cv']);
    const { error } = await client.from('student_profiles').update({ full_name: value.fullName,
      university: value.university, major: value.major, expected_graduation_year: value.expectedGraduationYear,
      gpa: value.gpa, skills: value.skills, goals: value.goals, ...files }).eq('user_id', user.id).select('id').single();
    if (error) throw error;
    const profile = await client.from('profiles').update({ name: value.fullName, ...(files.avatar_url ? { avatar_url: files.avatar_url } : {}) }).eq('id', user.id);
    if (profile.error) throw profile.error;
    return true;
  });
}

export async function saveCompany(input: unknown, uploads: FormData) {
  return result(async () => {
    const { client, user } = await requireAccount('COMPANY');
    const value = companySchema.parse(input);
    const files = await uploadFiles(client, user.id, uploads, ['logo']);
    const { error } = await client.from('company_profiles').update({ company_name: value.companyName,
      tax_code: value.taxCode, industry: value.industry, company_size: value.companySize, email: value.email,
      hotline: value.hotline, address: value.address, city: value.city, website: value.website,
      description: value.description, ...files }).eq('user_id', user.id).select('id').single();
    if (error) throw error;
    const profile = await client.from('profiles').update({ name: value.companyName }).eq('id', user.id);
    if (profile.error) throw profile.error;
    return true;
  });
}

async function uploadFiles(client: Awaited<ReturnType<typeof createClient>>, userId: string, form: FormData, fields: string[]) {
  const values: Record<string, string> = {};
  for (const field of fields) {
    const path = form.get(field);
    if (typeof path !== 'string' || !path) continue;
    if (!path.startsWith(`${userId}/`) || path.includes('..')) throw new Error('Đường dẫn tệp không hợp lệ.');
    const bucket = field === 'cv' ? 'resumes' : field === 'logo' ? 'company-logos' : 'avatars';
    const { error } = await client.storage.from(bucket).info(path);
    if (error) throw new Error('Không tìm thấy tệp đã tải lên.');
    if (field === 'cv') {
      values.cv_url = path;
      values.cv_file_name = z.string().min(1).max(255).parse(form.get('cvFileName'));
    } else values[field === 'logo' ? 'logo_url' : 'avatar_url'] = client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
  return values;
}

export async function saveJob(input: unknown, idInput?: string) {
  return result(async () => {
    const { client, user } = await requireAccount('COMPANY');
    const value = jobSchema.parse(input);
    const payload = { ...jobPayload(value), deadline: value.deadline || null };
    const query = idInput
      ? client.from('jobs').update(payload).eq('id', z.uuid().parse(idInput)).eq('company_id', user.id)
      : client.from('jobs').insert({ ...payload, company_id: user.id });
    const { data, error } = await query.select('id').single();
    if (error) throw error;
    return data.id as string;
  });
}

export async function deleteJob(idInput: unknown) {
  return result(async () => {
    const { client, user } = await requireAccount('COMPANY');
    const { error } = await client.from('jobs').delete().eq('id', z.uuid().parse(idInput)).eq('company_id', user.id).select('id').single();
    if (error) throw error;
    return true;
  });
}

export async function applyToJob(idInput: unknown, letterInput?: unknown) {
  return result(async () => {
    const { client, user } = await requireAccount('STUDENT');
    const jobId = z.uuid().parse(idInput);
    const coverLetter = z.string().trim().max(5000).optional().parse(letterInput);
    const profile = await client.from('student_profiles').select('*').eq('user_id', user.id).single();
    if (profile.error) throw profile.error;
    if (!profile.data.university || !profile.data.major || !profile.data.skills.length)
      throw new Error('Vui lòng hoàn thiện trường học, chuyên ngành và kỹ năng trong hồ sơ trước khi ứng tuyển.');
    const { error } = await client.from('applications').insert({ job_id: jobId, student_id: user.id, cover_letter: coverLetter });
    if (error) throw error;
    return true;
  });
}

export async function changeApplicationStatus(idInput: unknown, statusInput: unknown) {
  return result(async () => {
    const { client } = await requireAccount('COMPANY');
    const status = z.enum(['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED']).parse(statusInput);
    const { error } = await client.from('applications').update({ status }).eq('id', z.uuid().parse(idInput)).select('id').single();
    if (error) throw error;
    return true;
  });
}

export async function getResumeUrl(pathInput: unknown) {
  return result(async () => {
    const { client } = await requireAccount();
    const path = z.string().min(1).max(1024).parse(pathInput);
    const { data, error } = await client.storage.from('resumes').createSignedUrl(path, 60);
    if (error) throw error;
    return data.signedUrl;
  });
}
