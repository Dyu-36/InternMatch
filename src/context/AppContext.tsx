'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentProfile, CompanyProfile, Job, Application, Role } from '@/types';
import { initialUsers, initialStudentProfile, initialCompanyProfile, initialJobs, initialApplications } from '@/lib/mock-data';

interface AppContextType {
  currentUser: User | null;
  studentProfile: StudentProfile;
  companyProfile: CompanyProfile;
  jobs: Job[];
  applications: Application[];
  login: (username: string, passwordOrRole: string | Role) => boolean;
  logout: () => void;
  register: (username: string, password: string, role: Role) => boolean;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  addJob: (newJob: Omit<Job, 'id' | 'createdAt'>) => void;
  applyForJob: (jobId: string, coverLetter?: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const DEMO_PASSWORD = '123456';
const ACCOUNTS_STORAGE_KEY = 'internmatch_accounts';

interface StoredAccount {
  user: User;
  password: string;
}

function getStoredAccounts(): StoredAccount[] {
  try {
    const savedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return savedAccounts ? JSON.parse(savedAccounts) : [];
  } catch {
    return [];
  }
}

function saveStoredAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

function getAllAccounts(): StoredAccount[] {
  const demoAccounts = initialUsers.map((user) => ({ user, password: DEMO_PASSWORD }));
  return [...demoAccounts, ...getStoredAccounts()];
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(initialStudentProfile);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(initialCompanyProfile);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>(initialApplications);

  // Load from localStorage if present in browser
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('internmatch_user');
      // Hydrate persisted demo state once on the client after the initial render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedStudent = localStorage.getItem('internmatch_student');
      if (savedStudent) setStudentProfile(JSON.parse(savedStudent));

      const savedCompany = localStorage.getItem('internmatch_company');
      if (savedCompany) setCompanyProfile(JSON.parse(savedCompany));

      const savedJobs = localStorage.getItem('internmatch_jobs');
      if (savedJobs) setJobs(JSON.parse(savedJobs));

      const savedApps = localStorage.getItem('internmatch_apps');
      if (savedApps) setApplications(JSON.parse(savedApps));
    } catch {
      // Ignore JSON error
    }
  }, []);

  const login = (username: string, passwordOrRole: string | Role): boolean => {
    const trimmed = username.trim().toLowerCase();
    const legacyDemoLogin = passwordOrRole === 'STUDENT' || passwordOrRole === 'COMPANY';
    const password = legacyDemoLogin ? DEMO_PASSWORD : passwordOrRole;
    const found = getAllAccounts().find(
      (account) => account.user.username.toLowerCase() === trimmed && account.password === password,
    );

    if (!found) return false;

    setCurrentUser(found.user);
    localStorage.setItem('internmatch_user', JSON.stringify(found.user));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('internmatch_user');
  };

  const register = (username: string, password: string, role: Role): boolean => {
    const trimmedUsername = username.trim();
    const normalizedUsername = trimmedUsername.toLowerCase();
    if (!trimmedUsername || password.length < 6 || getAllAccounts().some(
      (account) => account.user.username.toLowerCase() === normalizedUsername,
    )) {
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: trimmedUsername,
      email: `${normalizedUsername}@internmatch.local`,
      name: trimmedUsername,
      role,
    };
    saveStoredAccounts([...getStoredAccounts(), { user: newUser, password }]);
    setCurrentUser(newUser);
    localStorage.setItem('internmatch_user', JSON.stringify(newUser));

    if (role === 'STUDENT') {
      const newProfile: StudentProfile = {
        ...initialStudentProfile,
        userId: newUser.id,
        fullName: trimmedUsername,
      };
      setStudentProfile(newProfile);
      localStorage.setItem('internmatch_student', JSON.stringify(newProfile));
    } else {
      const newCompany: CompanyProfile = {
        ...initialCompanyProfile,
        userId: newUser.id,
        companyName: trimmedUsername,
        email: newUser.email,
      };
      setCompanyProfile(newCompany);
      localStorage.setItem('internmatch_company', JSON.stringify(newCompany));
    }
    return true;
  };

  const updateStudentProfile = (updated: Partial<StudentProfile>) => {
    setStudentProfile((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('internmatch_student', JSON.stringify(next));
      return next;
    });
  };

  const updateCompanyProfile = (updated: Partial<CompanyProfile>) => {
    setCompanyProfile((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem('internmatch_company', JSON.stringify(next));
      return next;
    });
  };

  const addJob = (jobData: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      companyName: companyProfile.companyName || 'INUFF',
      companyInitial: (companyProfile.companyName || 'I')[0].toUpperCase(),
    };
    setJobs((prev) => {
      const next = [newJob, ...prev];
      localStorage.setItem('internmatch_jobs', JSON.stringify(next));
      return next;
    });
  };

  const applyForJob = (jobId: string, coverLetter?: string): boolean => {
    if (!currentUser) return false;
    const exists = applications.some((a) => a.jobId === jobId && a.studentId === currentUser.id);
    if (exists) return false;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      studentId: currentUser.id,
      studentName: studentProfile.fullName,
      studentUniversity: studentProfile.university,
      studentMajor: studentProfile.major,
      studentGpa: studentProfile.gpa,
      studentSkills: studentProfile.skills,
      cvFileName: studentProfile.cvFileName,
      coverLetter,
      status: 'PENDING',
      appliedAt: new Date().toISOString().split('T')[0],
    };

    setApplications((prev) => {
      const next = [newApp, ...prev];
      localStorage.setItem('internmatch_apps', JSON.stringify(next));
      return next;
    });
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        studentProfile,
        companyProfile,
        jobs,
        applications,
        login,
        logout,
        register,
        updateStudentProfile,
        updateCompanyProfile,
        addJob,
        applyForJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
