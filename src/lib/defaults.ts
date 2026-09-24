import type { StudentProfile, CompanyProfile } from '@/types';

export const emptyStudent: StudentProfile = {
  id: '', userId: '', fullName: '', university: '', major: '',
  expectedGraduationYear: new Date().getFullYear(), gpa: 0, skills: [], goals: '',
};
export const emptyCompany: CompanyProfile = {
  id: '', userId: '', companyName: '', taxCode: '', industry: '', companySize: '',
  email: '', hotline: '', address: '', city: '', website: '', description: '',
};
