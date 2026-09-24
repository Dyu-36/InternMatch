import { z } from 'zod';

const text = z.string().trim().min(1, 'Vui lòng điền đủ thông tin bắt buộc.').max(200);
const longText = z.string().trim().max(10000);
const skills = z.array(z.string().trim().min(1).max(80)).max(40);
export const credentialsSchema = z.object({
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,32}$/, 'Tên đăng nhập gồm 3–32 chữ cái không dấu, số hoặc dấu gạch dưới.'),
  password: z.string().min(6, 'Mật khẩu cần có ít nhất 6 ký tự.').max(128),
});
export const roleSchema = z.enum(['STUDENT', 'COMPANY']);
export const studentSchema = z.object({
  fullName: text, university: text, major: text,
  expectedGraduationYear: z.number().int().min(2000).max(2100),
  gpa: z.number().min(0).max(4), skills: skills.min(1), goals: longText,
});
export const companySchema = z.object({
  companyName: text, taxCode: text, industry: text, companySize: text,
  email: z.email(), hotline: text, address: text, city: text,
  website: z.union([z.literal(''), z.url().refine(v => /^https?:\/\//i.test(v))]),
  description: longText.min(1),
});
export const jobSchema = z.object({
  title: text, industry: text, location: text,
  jobType: z.enum(['Full-time', 'Part-time', 'Remote', 'Thực tập Toàn thời gian', 'Thực tập Bán thời gian']),
  minSalary: z.number().int().min(0).max(2147483647), maxSalary: z.number().int().min(0).max(2147483647),
  skills, description: longText.min(1), requirements: longText.min(1), benefits: longText.min(1),
  quota: z.number().int().min(1).max(100000),
  deadline: z.union([z.literal(''), z.iso.date()]).optional(),
  isFeatured: z.boolean().optional(), isHot: z.boolean().optional(),
}).refine(v => v.maxSalary >= v.minSalary, 'Mức trợ cấp tối đa phải lớn hơn hoặc bằng mức tối thiểu.');
