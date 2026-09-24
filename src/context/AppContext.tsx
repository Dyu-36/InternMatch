'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User, StudentProfile, CompanyProfile, Job, Application, Role, ApplicationStatus } from '@/types';
import * as actions from '@/app/actions';
import { authEmail } from '@/lib/auth';
import { createClient } from '@/lib/supabase/client';

export type ProfileFiles = { avatarFile?: File; cvFile?: File; logoFile?: File };
export type AppState = { currentUser: User | null; studentProfile: StudentProfile; companyProfile: CompanyProfile; jobs: Job[]; applications: Application[] };
interface AppContextType extends AppState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (username: string, password: string, role: Role) => Promise<boolean>;
  updateStudentProfile: (profile: Partial<StudentProfile>, files?: ProfileFiles) => Promise<void>;
  updateCompanyProfile: (profile: Partial<CompanyProfile>, files?: ProfileFiles) => Promise<void>;
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => Promise<void>;
  updateJob: (id: string, job: Partial<Job>) => Promise<void>;
  removeJob: (id: string) => Promise<void>;
  applyForJob: (id: string, letter?: string) => Promise<boolean>;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => Promise<void>;
}
const AppContext = createContext<AppContextType | undefined>(undefined);

function unwrap<T>(response: { data: T | null; error: string | null }): T {
  if (response.error) throw new Error(response.error);
  return response.data as T;
}
async function formFiles(userId: string, files?: ProfileFiles) {
  const form = new FormData();
  const client = createClient();
  for (const [field, file, bucket] of [
    ['avatar', files?.avatarFile, 'avatars'], ['cv', files?.cvFile, 'resumes'], ['logo', files?.logoFile, 'company-logos'],
  ] as const) {
    if (!file) continue;
    const types = field === 'cv' ? ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] : ['image/jpeg', 'image/png', 'image/webp'];
    if (!types.includes(file.type) || file.size > (field === 'cv' ? 10 : 5) * 1024 * 1024) throw new Error('Định dạng hoặc dung lượng tệp không hợp lệ.');
    const path = `${userId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    const { error } = await client.storage.from(bucket).upload(path, file, { contentType: file.type });
    if (error) throw new Error('Không thể tải tệp lên. Vui lòng thử lại.');
    form.set(field, path);
    if (field === 'cv') form.set('cvFileName', file.name);
  }
  return form;
}

export function AppProvider({ children, initialState }: { children: React.ReactNode; initialState: AppState }) {
  const [state, setState] = useState(initialState);
  const router = useRouter();
  const refresh = async () => { setState(unwrap(await actions.getAppState())); router.refresh(); };
  const login = async (username: string, password: string) => { unwrap(await actions.signIn({ username, password })); await refresh(); return true; };
  const register = async (username: string, password: string, role: Role) => {
    const client = createClient();
    const { error } = await client.auth.signUp({
      email: authEmail(username),
      password,
      options: { data: { username, role } },
    });
    if (error) {
      const messages: Record<string, string> = {
        user_already_exists: 'Tên đăng nhập đã tồn tại.',
        over_request_rate_limit: 'Hệ thống đang giới hạn số lần đăng ký. Vui lòng chờ vài phút rồi thử lại.',
        over_email_send_rate_limit: 'Hệ thống đang giới hạn số lần đăng ký. Vui lòng chờ vài phút rồi thử lại.',
      };
      throw new Error(messages[error.code ?? ''] ?? error.message);
    }
    await refresh();
    return true;
  };
  const logout = async () => { unwrap(await actions.signOut()); await refresh(); router.push('/'); };
  const updateStudentProfile = async (profile: Partial<StudentProfile>, files?: ProfileFiles) => { unwrap(await actions.saveStudent(profile, await formFiles(state.currentUser!.id, files))); await refresh(); };
  const updateCompanyProfile = async (profile: Partial<CompanyProfile>, files?: ProfileFiles) => { unwrap(await actions.saveCompany(profile, await formFiles(state.currentUser!.id, files))); await refresh(); };
  const addJob = async (job: Omit<Job, 'id' | 'createdAt'>) => { unwrap(await actions.saveJob(job)); await refresh(); };
  const updateJob = async (id: string, job: Partial<Job>) => { unwrap(await actions.saveJob(job, id)); await refresh(); };
  const removeJob = async (id: string) => { unwrap(await actions.deleteJob(id)); await refresh(); };
  const applyForJob = async (id: string, letter?: string) => { unwrap(await actions.applyToJob(id, letter)); await refresh(); return true; };
  const updateApplicationStatus = async (id: string, status: ApplicationStatus) => { unwrap(await actions.changeApplicationStatus(id, status)); await refresh(); };
  return <AppContext.Provider value={{ ...state, login, logout, register, updateStudentProfile, updateCompanyProfile, addJob, updateJob, removeJob, applyForJob, updateApplicationStatus }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
