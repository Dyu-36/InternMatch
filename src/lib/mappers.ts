import type { Application, ApplicationStatus, CompanyProfile, Job, JobType, Role, StudentProfile, User } from '@/types';

type DbRow = Record<string, unknown>;

function text(row: DbRow, key: string, fallback = '') {
  return typeof row[key] === 'string' ? row[key] as string : fallback;
}
function number(row: DbRow, key: string, fallback = 0) {
  return typeof row[key] === 'number' ? row[key] as number : fallback;
}
function optionalText(row: DbRow, key: string) {
  const value = row[key];
  return typeof value === 'string' && value ? value : undefined;
}
function strings(row: DbRow, key: string) {
  return Array.isArray(row[key]) ? (row[key] as unknown[]).filter((value): value is string => typeof value === 'string') : [];
}

export function mapUser(row: DbRow): User {
  return {
    id: text(row, 'id'), username: text(row, 'username'), email: text(row, 'email'),
    role: text(row, 'role') as Role, name: text(row, 'name'), avatarUrl: optionalText(row, 'avatar_url'),
  };
}

export function mapStudent(row: DbRow, fallback: StudentProfile, userId?: string): StudentProfile {
  return {
    ...fallback,
    id: text(row, 'id', fallback.id), userId: text(row, 'user_id', userId ?? fallback.userId),
    fullName: text(row, 'full_name', fallback.fullName), avatarUrl: optionalText(row, 'avatar_url'),
    cvUrl: optionalText(row, 'cv_url'), cvFileName: optionalText(row, 'cv_file_name'),
    university: text(row, 'university', fallback.university), major: text(row, 'major', fallback.major),
    expectedGraduationYear: number(row, 'expected_graduation_year', fallback.expectedGraduationYear),
    gpa: number(row, 'gpa', fallback.gpa), skills: strings(row, 'skills'), goals: text(row, 'goals', fallback.goals),
  };
}

export function mapCompany(row: DbRow, fallback: CompanyProfile, userId?: string): CompanyProfile {
  return {
    ...fallback,
    id: text(row, 'id', fallback.id), userId: text(row, 'user_id', userId ?? fallback.userId),
    companyName: text(row, 'company_name', fallback.companyName), taxCode: text(row, 'tax_code', fallback.taxCode),
    industry: text(row, 'industry', fallback.industry), companySize: text(row, 'company_size', fallback.companySize),
    email: text(row, 'email', fallback.email), hotline: text(row, 'hotline', fallback.hotline),
    address: text(row, 'address', fallback.address), city: text(row, 'city', fallback.city),
    website: text(row, 'website', fallback.website), logoUrl: optionalText(row, 'logo_url'),
    description: text(row, 'description', fallback.description),
  };
}

export function mapJob(row: DbRow): Job {
  return {
    id: text(row, 'id'), companyId: text(row, 'company_id'), companyName: text(row, 'company_name'),
    companyLogo: optionalText(row, 'company_logo'), companyInitial: optionalText(row, 'company_initial'),
    title: text(row, 'title'), industry: text(row, 'industry'), jobType: text(row, 'job_type') as JobType,
    location: text(row, 'location'), minSalary: number(row, 'min_salary'), maxSalary: number(row, 'max_salary'),
    skills: strings(row, 'skills'), description: text(row, 'description'), requirements: text(row, 'requirements'),
    benefits: text(row, 'benefits'), isHot: Boolean(row.is_hot), isFeatured: Boolean(row.is_featured),
    quota: number(row, 'quota', 1), createdAt: text(row, 'created_at'), deadline: optionalText(row, 'deadline'),
  };
}

export function mapApplication(row: DbRow): Application {
  return {
    id: text(row, 'id'), jobId: text(row, 'job_id'), studentId: text(row, 'student_id'),
    studentAvatarUrl: optionalText(row, 'student_avatar_url'),
    studentName: text(row, 'student_name'), studentUniversity: text(row, 'student_university'),
    studentMajor: text(row, 'student_major'), studentGpa: number(row, 'student_gpa'),
    studentSkills: strings(row, 'student_skills'), coverLetter: optionalText(row, 'cover_letter'),
    cvUrl: optionalText(row, 'cv_url'), cvFileName: optionalText(row, 'cv_file_name'),
    status: text(row, 'status', 'PENDING') as ApplicationStatus, appliedAt: text(row, 'applied_at'),
  };
}

export function jobPayload(value: {
  title: string; industry: string; jobType: JobType; location: string; minSalary: number; maxSalary: number;
  skills: string[]; description: string; requirements: string; benefits: string; quota: number;
  isFeatured?: boolean; isHot?: boolean;
}) {
  return {
    title: value.title, industry: value.industry, job_type: value.jobType, location: value.location,
    min_salary: value.minSalary, max_salary: value.maxSalary, skills: value.skills,
    description: value.description, requirements: value.requirements, benefits: value.benefits,
    quota: value.quota, is_featured: value.isFeatured ?? false, is_hot: value.isHot ?? false,
  };
}
