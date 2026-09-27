export type Role = 'STUDENT' | 'COMPANY';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  name: string;
  avatarUrl?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  cvUrl?: string;
  cvFileName?: string;
  university: string;
  major: string;
  expectedGraduationYear: number;
  gpa: number; // 4.0 scale
  skills: string[];
  goals: string;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  taxCode: string;
  industry: string;
  companySize: string; // e.g. "50-200 nhân viên"
  email: string;
  hotline: string;
  provinceCode: string;
  wardCode: string;
  addressDetail: string;
  address: string; // derived display: ward name plus street detail
  city: string; // derived display: province name
  website: string;
  logoUrl?: string;
  description: string;
}

export type JobType = 'Full-time' | 'Part-time' | 'Remote' | 'Thực tập Toàn thời gian' | 'Thực tập Bán thời gian';

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  companyInitial?: string;
  title: string;
  industry: string;
  jobType: JobType;
  provinceCode: string;
  wardCode: string;
  location: string; // derived display: ward name plus province name
  addressDetail: string;
  minSalary: number;
  maxSalary: number;
  salaryText?: string;
  skills: string[];
  description: string;
  requirements: string;
  benefits: string;
  isHot?: boolean;
  isFeatured?: boolean;
  quota?: number;
  createdAt: string;
  deadline?: string;
}

// Write payload for a posting: the display `location` is derived server-side
// from the province/ward codes, so the client never sends it.
export type JobDraft = Omit<Job, 'id' | 'createdAt' | 'location'>;

export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentAvatarUrl?: string;
  studentName: string;
  studentUniversity: string;
  studentMajor: string;
  studentGpa: number;
  studentSkills: string[];
  coverLetter?: string;
  cvUrl?: string;
  cvFileName?: string;
  status: ApplicationStatus;
  appliedAt: string;
}
