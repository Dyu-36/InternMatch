'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, StudentProfile, CompanyProfile, Job, Application, Role, ApplicationStatus } from '@/types';
import { initialUsers, initialStudentProfile, initialCompanyProfile, initialJobs, initialApplications } from '@/lib/mock-data';
import {
  loadStoredSession,
  publicStorageUrl,
  saveStoredSession,
  supabaseAuthSignIn,
  supabaseAuthSignOut,
  supabaseAuthSignUp,
  supabaseConfigured,
  supabaseRest,
  supabaseStorageUpload,
} from '@/lib/supabase';

export type ProfileFiles = { avatarFile?: File; cvFile?: File; logoFile?: File };

interface AppContextType {
  currentUser: User | null;
  studentProfile: StudentProfile;
  companyProfile: CompanyProfile;
  jobs: Job[];
  applications: Application[];
  login: (username: string, passwordOrRole: string | Role) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string, role: Role) => Promise<boolean>;
  updateStudentProfile: (profile: Partial<StudentProfile>, files?: ProfileFiles) => Promise<void>;
  updateCompanyProfile: (profile: Partial<CompanyProfile>, files?: ProfileFiles) => Promise<void>;
  addJob: (newJob: Omit<Job, 'id' | 'createdAt'>) => Promise<void>;
  updateJob: (jobId: string, updated: Partial<Job>) => Promise<void>;
  removeJob: (jobId: string) => Promise<void>;
  applyForJob: (jobId: string, coverLetter?: string) => Promise<boolean>;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const DEMO_PASSWORD = '123456';
const ACCOUNTS_STORAGE_KEY = 'internmatch_accounts';

interface StoredAccount { user: User; password: string; }

type DbRow = Record<string, unknown>;

function getStoredAccounts(): StoredAccount[] {
  try {
    const savedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return savedAccounts ? JSON.parse(savedAccounts) : [];
  } catch { return []; }
}

function saveStoredAccounts(accounts: StoredAccount[]) { localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts)); }
function getAllAccounts(): StoredAccount[] { return [...initialUsers.map((user) => ({ user, password: DEMO_PASSWORD })), ...getStoredAccounts()]; }

function today() { return new Date().toISOString().split('T')[0]; }

function mapUser(row: DbRow, fallback?: Partial<User>): User {
  return {
    id: String(row.id ?? fallback?.id ?? ''),
    username: String(row.username ?? fallback?.username ?? ''),
    email: String(row.email ?? fallback?.email ?? ''),
    role: (row.role ?? fallback?.role ?? 'STUDENT') as Role,
    name: String(row.name ?? fallback?.name ?? row.username ?? ''),
    avatarUrl: row.avatar_url ? String(row.avatar_url) : fallback?.avatarUrl,
  };
}

function mapStudent(row: DbRow, fallback: StudentProfile, userId: string): StudentProfile {
  return {
    ...fallback,
    id: String(row.id ?? fallback.id),
    userId,
    fullName: String(row.full_name ?? fallback.fullName),
    avatarUrl: row.avatar_url ? String(row.avatar_url) : undefined,
    cvUrl: row.cv_url ? String(row.cv_url) : undefined,
    cvFileName: row.cv_file_name ? String(row.cv_file_name) : undefined,
    university: String(row.university ?? fallback.university),
    major: String(row.major ?? fallback.major),
    expectedGraduationYear: Number(row.expected_graduation_year ?? fallback.expectedGraduationYear),
    gpa: Number(row.gpa ?? fallback.gpa),
    skills: Array.isArray(row.skills) ? row.skills.map(String) : fallback.skills,
    goals: String(row.goals ?? fallback.goals),
  };
}

function mapCompany(row: DbRow, fallback: CompanyProfile, userId: string): CompanyProfile {
  return {
    ...fallback,
    id: String(row.id ?? fallback.id),
    userId,
    companyName: String(row.company_name ?? fallback.companyName),
    taxCode: String(row.tax_code ?? fallback.taxCode),
    industry: String(row.industry ?? fallback.industry),
    companySize: String(row.company_size ?? fallback.companySize),
    email: String(row.email ?? fallback.email),
    hotline: String(row.hotline ?? fallback.hotline),
    address: String(row.address ?? fallback.address),
    city: String(row.city ?? fallback.city),
    website: String(row.website ?? fallback.website),
    logoUrl: row.logo_url ? String(row.logo_url) : undefined,
    description: String(row.description ?? fallback.description),
  };
}

function mapJob(row: DbRow): Job {
  return {
    id: String(row.id),
    companyId: String(row.company_id),
    companyName: String(row.company_name ?? ''),
    companyLogo: row.company_logo ? String(row.company_logo) : undefined,
    companyInitial: row.company_initial ? String(row.company_initial) : undefined,
    title: String(row.title ?? ''),
    industry: String(row.industry ?? ''),
    jobType: String(row.job_type ?? 'Thực tập Toàn thời gian') as Job['jobType'],
    location: String(row.location ?? ''),
    minSalary: Number(row.min_salary ?? 0),
    maxSalary: Number(row.max_salary ?? 0),
    skills: Array.isArray(row.skills) ? row.skills.map(String) : [],
    description: String(row.description ?? ''),
    requirements: String(row.requirements ?? ''),
    benefits: String(row.benefits ?? ''),
    isHot: Boolean(row.is_hot),
    isFeatured: Boolean(row.is_featured),
    quota: Number(row.quota ?? 1),
    createdAt: String(row.created_at ?? today()),
    deadline: row.deadline ? String(row.deadline) : undefined,
  };
}

function mapApplication(row: DbRow): Application {
  return {
    id: String(row.id),
    jobId: String(row.job_id),
    studentId: String(row.student_id),
    studentName: String(row.student_name ?? ''),
    studentUniversity: String(row.student_university ?? ''),
    studentMajor: String(row.student_major ?? ''),
    studentGpa: Number(row.student_gpa ?? 0),
    studentSkills: Array.isArray(row.student_skills) ? row.student_skills.map(String) : [],
    coverLetter: row.cover_letter ? String(row.cover_letter) : undefined,
    cvUrl: row.cv_url ? String(row.cv_url) : undefined,
    cvFileName: row.cv_file_name ? String(row.cv_file_name) : undefined,
    status: String(row.status ?? 'PENDING') as ApplicationStatus,
    appliedAt: String(row.applied_at ?? today()),
  };
}

function jobPayload(job: Partial<Job>) {
  return {
    ...(job.companyId !== undefined ? { company_id: job.companyId } : {}),
    ...(job.companyName !== undefined ? { company_name: job.companyName } : {}),
    ...(job.companyLogo !== undefined ? { company_logo: job.companyLogo } : {}),
    ...(job.companyInitial !== undefined ? { company_initial: job.companyInitial } : {}),
    ...(job.title !== undefined ? { title: job.title } : {}),
    ...(job.industry !== undefined ? { industry: job.industry } : {}),
    ...(job.jobType !== undefined ? { job_type: job.jobType } : {}),
    ...(job.location !== undefined ? { location: job.location } : {}),
    ...(job.minSalary !== undefined ? { min_salary: job.minSalary } : {}),
    ...(job.maxSalary !== undefined ? { max_salary: job.maxSalary } : {}),
    ...(job.skills !== undefined ? { skills: job.skills } : {}),
    ...(job.description !== undefined ? { description: job.description } : {}),
    ...(job.requirements !== undefined ? { requirements: job.requirements } : {}),
    ...(job.benefits !== undefined ? { benefits: job.benefits } : {}),
    ...(job.isHot !== undefined ? { is_hot: job.isHot } : {}),
    ...(job.isFeatured !== undefined ? { is_featured: job.isFeatured } : {}),
    ...(job.quota !== undefined ? { quota: job.quota } : {}),
    ...(job.deadline !== undefined ? { deadline: job.deadline || null } : {}),
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(initialStudentProfile);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(initialCompanyProfile);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>(initialApplications);

  const loadBackendState = async (user: User, accessToken: string) => {
    const [studentRows, companyRows, jobRows, applicationRows] = await Promise.all([
      supabaseRest<DbRow[]>(`student_profiles?user_id=eq.${user.id}&select=*`, {}, accessToken),
      supabaseRest<DbRow[]>(`company_profiles?user_id=eq.${user.id}&select=*`, {}, accessToken),
      supabaseRest<DbRow[]>('jobs?select=*&order=created_at.desc', {}, accessToken),
      supabaseRest<DbRow[]>('applications?select=*&order=applied_at.desc', {}, accessToken),
    ]);
    if (studentRows[0]) setStudentProfile(mapStudent(studentRows[0], { ...initialStudentProfile, userId: user.id }, user.id));
    if (companyRows[0]) setCompanyProfile(mapCompany(companyRows[0], { ...initialCompanyProfile, userId: user.id }, user.id));
    setJobs(jobRows.map(mapJob));
    setApplications(applicationRows.map(mapApplication));
  };

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      if (!supabaseConfigured) {
        try {
          const savedUser = localStorage.getItem('internmatch_user');
          if (savedUser && active) setCurrentUser(JSON.parse(savedUser));
          const savedStudent = localStorage.getItem('internmatch_student');
          if (savedStudent && active) setStudentProfile(JSON.parse(savedStudent));
          const savedCompany = localStorage.getItem('internmatch_company');
          if (savedCompany && active) setCompanyProfile(JSON.parse(savedCompany));
          const savedJobs = localStorage.getItem('internmatch_jobs');
          if (savedJobs && active) setJobs(JSON.parse(savedJobs));
          const savedApps = localStorage.getItem('internmatch_apps');
          if (savedApps && active) setApplications(JSON.parse(savedApps));
        } catch { /* Ignore malformed demo state. */ }
        return;
      }
      const session = loadStoredSession();
      if (!session || !active) return;
      try {
        const rows = await supabaseRest<DbRow[]>(`profiles?id=eq.${session.user.id}&select=*`, {}, session.access_token);
        if (!rows[0]) return;
        const user = mapUser(rows[0]);
        if (!active) return;
        setCurrentUser(user);
        await loadBackendState(user, session.access_token);
      } catch (error) {
        console.error('Unable to load Supabase state', error);
      }
    };
    void bootstrap();
    return () => { active = false; };
  }, []);

  const login = async (username: string, passwordOrRole: string | Role): Promise<boolean> => {
    if (supabaseConfigured) {
      if (passwordOrRole === 'STUDENT' || passwordOrRole === 'COMPANY') return false;
      const session = await supabaseAuthSignIn(username, passwordOrRole);
      saveStoredSession(session);
      const rows = await supabaseRest<DbRow[]>(`profiles?id=eq.${session.user.id}&select=*`, {}, session.access_token);
      if (!rows[0]) throw new Error('Tài khoản chưa có hồ sơ InternMatch.');
      const user = mapUser(rows[0]);
      setCurrentUser(user);
      await loadBackendState(user, session.access_token);
      return true;
    }
    const trimmed = username.trim().toLowerCase();
    const password = passwordOrRole === 'STUDENT' || passwordOrRole === 'COMPANY' ? DEMO_PASSWORD : passwordOrRole;
    const found = getAllAccounts().find((account) => account.user.username.toLowerCase() === trimmed && account.password === password);
    if (!found) return false;
    setCurrentUser(found.user);
    localStorage.setItem('internmatch_user', JSON.stringify(found.user));
    return true;
  };

  const logout = () => {
    const session = loadStoredSession();
    if (supabaseConfigured && session) void supabaseAuthSignOut(session.access_token);
    saveStoredSession(null);
    setCurrentUser(null);
    if (!supabaseConfigured) localStorage.removeItem('internmatch_user');
  };

  const register = async (username: string, password: string, role: Role): Promise<boolean> => {
    const trimmedUsername = username.trim();
    const normalizedUsername = trimmedUsername.toLowerCase();
    if (!trimmedUsername || password.length < 6) return false;
    if (supabaseConfigured) {
      const result = await supabaseAuthSignUp(trimmedUsername, password, role);
      const session = result.session;
      if (!session) throw new Error('Supabase đang yêu cầu xác nhận email. Hãy tắt Confirm email trong Authentication trước khi đăng ký bằng username.');
      saveStoredSession(session);
      const user: User = { id: session.user.id, username: trimmedUsername, email: session.user.email ?? `${normalizedUsername}@internmatch.local`, role, name: trimmedUsername };
      await supabaseRest('profiles', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ id: user.id, username: user.username, email: user.email, role, name: user.name }) }, session.access_token);
      if (role === 'STUDENT') {
        const profile = { ...initialStudentProfile, id: '', userId: user.id, fullName: trimmedUsername };
        await supabaseRest('student_profiles', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ user_id: user.id, full_name: profile.fullName, university: profile.university, major: profile.major, expected_graduation_year: profile.expectedGraduationYear, gpa: profile.gpa, skills: profile.skills, goals: profile.goals }) }, session.access_token);
        setStudentProfile(profile);
      } else {
        const profile = { ...initialCompanyProfile, id: '', userId: user.id, companyName: trimmedUsername, email: user.email };
        await supabaseRest('company_profiles', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ user_id: user.id, company_name: profile.companyName, email: profile.email, industry: profile.industry, company_size: profile.companySize, tax_code: profile.taxCode, hotline: profile.hotline, address: profile.address, city: profile.city, website: profile.website, description: profile.description }) }, session.access_token);
        setCompanyProfile(profile);
      }
      setCurrentUser(user);
      return true;
    }
    if (getAllAccounts().some((account) => account.user.username.toLowerCase() === normalizedUsername)) return false;
    const newUser: User = { id: `user-${Date.now()}`, username: trimmedUsername, email: `${normalizedUsername}@internmatch.local`, name: trimmedUsername, role };
    saveStoredAccounts([...getStoredAccounts(), { user: newUser, password }]);
    setCurrentUser(newUser);
    localStorage.setItem('internmatch_user', JSON.stringify(newUser));
    if (role === 'STUDENT') {
      const newProfile = { ...initialStudentProfile, userId: newUser.id, fullName: trimmedUsername };
      setStudentProfile(newProfile); localStorage.setItem('internmatch_student', JSON.stringify(newProfile));
    } else {
      const newProfile = { ...initialCompanyProfile, userId: newUser.id, companyName: trimmedUsername, email: newUser.email };
      setCompanyProfile(newProfile); localStorage.setItem('internmatch_company', JSON.stringify(newProfile));
    }
    return true;
  };

  const updateStudentProfile = async (updated: Partial<StudentProfile>, files?: ProfileFiles) => {
    const next = { ...studentProfile, ...updated };
    const session = loadStoredSession();
    if (supabaseConfigured && currentUser && session) {
      if (files?.avatarFile) {
        const path = `${currentUser.id}/avatar-${Date.now()}-${files.avatarFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
        await supabaseStorageUpload('avatars', path, files.avatarFile, session.access_token);
        next.avatarUrl = publicStorageUrl('avatars', path);
      }
      if (files?.cvFile) {
        const path = `${currentUser.id}/cv-${Date.now()}-${files.cvFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
        await supabaseStorageUpload('resumes', path, files.cvFile, session.access_token);
        next.cvUrl = path;
        next.cvFileName = files.cvFile.name;
      }
      await supabaseRest('student_profiles?on_conflict=user_id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ user_id: currentUser.id, full_name: next.fullName, avatar_url: next.avatarUrl ?? null, cv_url: next.cvUrl ?? null, cv_file_name: next.cvFileName ?? null, university: next.university, major: next.major, expected_graduation_year: next.expectedGraduationYear, gpa: next.gpa, skills: next.skills, goals: next.goals }) }, session.access_token);
    } else {
      localStorage.setItem('internmatch_student', JSON.stringify(next));
    }
    setStudentProfile(next);
  };

  const updateCompanyProfile = async (updated: Partial<CompanyProfile>, files?: ProfileFiles) => {
    const next = { ...companyProfile, ...updated };
    const session = loadStoredSession();
    if (supabaseConfigured && currentUser && session) {
      if (files?.logoFile) {
        const path = `${currentUser.id}/logo-${Date.now()}-${files.logoFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
        await supabaseStorageUpload('company-logos', path, files.logoFile, session.access_token);
        next.logoUrl = publicStorageUrl('company-logos', path);
      }
      await supabaseRest('company_profiles?on_conflict=user_id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ user_id: currentUser.id, company_name: next.companyName, tax_code: next.taxCode, industry: next.industry, company_size: next.companySize, email: next.email, hotline: next.hotline, address: next.address, city: next.city, website: next.website, logo_url: next.logoUrl ?? null, description: next.description }) }, session.access_token);
    } else {
      localStorage.setItem('internmatch_company', JSON.stringify(next));
    }
    setCompanyProfile(next);
  };

  const addJob = async (jobData: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = { ...jobData, id: `job-${Date.now()}`, createdAt: today() };
    const session = loadStoredSession();
    if (supabaseConfigured && currentUser && session) {
      const rows = await supabaseRest<DbRow[]>('jobs', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ ...jobPayload(jobData), company_id: currentUser.id, company_name: companyProfile.companyName, company_logo: companyProfile.logoUrl ?? null, company_initial: (companyProfile.companyName || 'I')[0].toUpperCase() }) }, session.access_token);
      if (rows[0]) newJob.id = String(rows[0].id);
    } else {
      localStorage.setItem('internmatch_jobs', JSON.stringify([newJob, ...jobs]));
    }
    setJobs((previous) => [newJob, ...previous]);
  };

  const updateJob = async (jobId: string, updated: Partial<Job>) => {
    const nextJobs = jobs.map((job) => job.id === jobId ? { ...job, ...updated } : job);
    const session = loadStoredSession();
    if (supabaseConfigured && currentUser && session) await supabaseRest(`jobs?id=eq.${jobId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(jobPayload(updated)) }, session.access_token);
    else localStorage.setItem('internmatch_jobs', JSON.stringify(nextJobs));
    setJobs(nextJobs);
  };

  const removeJob = async (jobId: string) => {
    const nextJobs = jobs.filter((job) => job.id !== jobId);
    const session = loadStoredSession();
    if (supabaseConfigured && currentUser && session) await supabaseRest(`jobs?id=eq.${jobId}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } }, session.access_token);
    else localStorage.setItem('internmatch_jobs', JSON.stringify(nextJobs));
    setJobs(nextJobs);
  };

  const applyForJob = async (jobId: string, coverLetter?: string): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'STUDENT' || applications.some((application) => application.jobId === jobId && application.studentId === currentUser.id)) return false;
    const newApplication: Application = { id: `app-${Date.now()}`, jobId, studentId: currentUser.id, studentName: studentProfile.fullName, studentUniversity: studentProfile.university, studentMajor: studentProfile.major, studentGpa: studentProfile.gpa, studentSkills: studentProfile.skills, cvFileName: studentProfile.cvFileName, coverLetter, status: 'PENDING', appliedAt: today() };
    const session = loadStoredSession();
    if (supabaseConfigured && session) {
      const rows = await supabaseRest<DbRow[]>('applications', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ job_id: jobId, student_id: currentUser.id, student_name: newApplication.studentName, student_university: newApplication.studentUniversity, student_major: newApplication.studentMajor, student_gpa: newApplication.studentGpa, student_skills: newApplication.studentSkills, cover_letter: coverLetter ?? null, cv_url: studentProfile.cvUrl ?? null, cv_file_name: studentProfile.cvFileName ?? null }) }, session.access_token);
      if (rows[0]) newApplication.id = String(rows[0].id);
    } else localStorage.setItem('internmatch_apps', JSON.stringify([newApplication, ...applications]));
    setApplications((previous) => [newApplication, ...previous]);
    return true;
  };

  const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    const nextApplications = applications.map((application) => application.id === applicationId ? { ...application, status } : application);
    const session = loadStoredSession();
    if (supabaseConfigured && currentUser && session) await supabaseRest(`applications?id=eq.${applicationId}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status }) }, session.access_token);
    else localStorage.setItem('internmatch_apps', JSON.stringify(nextApplications));
    setApplications(nextApplications);
  };

  return <AppContext.Provider value={{ currentUser, studentProfile, companyProfile, jobs, applications, login, logout, register, updateStudentProfile, updateCompanyProfile, addJob, updateJob, removeJob, applyForJob, updateApplicationStatus }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
