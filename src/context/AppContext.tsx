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
  login: (username: string, role?: Role) => boolean;
  logout: () => void;
  register: (name: string, username: string, email: string, role: Role) => void;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
  addJob: (newJob: Omit<Job, 'id' | 'createdAt'>) => void;
  applyForJob: (jobId: string, coverLetter?: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]); // Default to student 'nhitran' for instant demo
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(initialStudentProfile);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(initialCompanyProfile);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>(initialApplications);

  // Load from localStorage if present in browser
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('internmatch_user');
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

  const login = (username: string, targetRole?: Role): boolean => {
    const trimmed = username.trim().toLowerCase();
    const found = initialUsers.find((u) => u.username.toLowerCase() === trimmed);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('internmatch_user', JSON.stringify(found));
      return true;
    }

    // Dynamic mock user for demo
    const dynamicUser: User = {
      id: `user-${Date.now()}`,
      username: username.trim(),
      email: `${username.trim()}@internmatch.vn`,
      role: targetRole || 'STUDENT',
      name: targetRole === 'COMPANY' ? username : `Thực tập sinh ${username}`,
    };
    setCurrentUser(dynamicUser);
    localStorage.setItem('internmatch_user', JSON.stringify(dynamicUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('internmatch_user');
  };

  const register = (name: string, username: string, email: string, role: Role) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      email,
      name,
      role,
    };
    setCurrentUser(newUser);
    localStorage.setItem('internmatch_user', JSON.stringify(newUser));

    if (role === 'STUDENT') {
      const newProfile: StudentProfile = {
        ...initialStudentProfile,
        userId: newUser.id,
        fullName: name,
      };
      setStudentProfile(newProfile);
      localStorage.setItem('internmatch_student', JSON.stringify(newProfile));
    } else {
      const newCompany: CompanyProfile = {
        ...initialCompanyProfile,
        userId: newUser.id,
        companyName: name,
        email,
      };
      setCompanyProfile(newCompany);
      localStorage.setItem('internmatch_company', JSON.stringify(newCompany));
    }
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
