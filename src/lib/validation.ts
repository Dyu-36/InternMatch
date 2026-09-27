import { z } from 'zod';
import { resolveLocation } from '@/lib/vn-divisions';

const text = z.string().trim().min(1, 'Vui lòng điền đủ thông tin bắt buộc.').max(200);
const longText = z.string().trim().max(10000);
const skills = z.array(z.string().trim().min(1).max(80)).max(40);
const email = z.string().trim().toLowerCase().pipe(z.email('Vui lòng nhập email hợp lệ.'));
const password = z.string().min(6, 'Mật khẩu cần có ít nhất 6 ký tự.').max(128);
const provinceCode = z.string().regex(/^\d{2}$/, 'Vui lòng chọn tỉnh / thành phố.');
const wardCode = z.string().regex(/^\d{5}$/, 'Vui lòng chọn xã / phường / đặc khu.');
const addressDetail = text.min(3, 'Vui lòng nhập địa chỉ cụ thể.');
// A ward code only means something together with its province, so the pair is
// checked against the bundled administrative dataset.
function checkLocation(value: { provinceCode: string; wardCode: string }, ctx: z.RefinementCtx) {
  if (value.provinceCode && value.wardCode && !resolveLocation({ ...value, addressDetail: '' })) {
    ctx.addIssue({ code: 'custom', path: ['wardCode'], message: 'Xã / phường / đặc khu không thuộc tỉnh / thành phố đã chọn.' });
  }
}
export const credentialsSchema = z.object({
  identifier: z.string().trim().min(1).max(320).refine((value) => {
    if (value.includes('@')) return z.email().safeParse(value).success;
    return /^[a-z0-9_]{3,32}$/i.test(value);
  }, 'Vui lòng nhập email hoặc username hợp lệ.'),
  password,
});
export const roleSchema = z.enum(['STUDENT', 'COMPANY']);
export const registrationSchema = z.object({
  displayName: text.min(2, 'Vui lòng nhập họ tên hoặc tên công ty.').max(120),
  email,
  password,
  confirmPassword: z.string().max(128),
  role: roleSchema,
}).refine((value) => value.password === value.confirmPassword, {
  message: 'Mật khẩu xác nhận chưa khớp.',
  path: ['confirmPassword'],
});
export const forgotPasswordSchema = z.object({ email });
export const resetPasswordSchema = z.object({
  password,
  confirmPassword: z.string().max(128),
}).refine((value) => value.password === value.confirmPassword, {
  message: 'Mật khẩu xác nhận chưa khớp.',
  path: ['confirmPassword'],
});
export const studentSchema = z.object({
  fullName: text, university: text, major: text,
  expectedGraduationYear: z.number().int().min(2000).max(2100),
  gpa: z.number().min(0).max(4), skills: skills.min(1), goals: longText,
});
export const companySchema = z.object({
  companyName: text, taxCode: text, industry: text, companySize: text,
  email: z.email(), hotline: text, provinceCode, wardCode, addressDetail,
  website: z.union([z.literal(''), z.url().refine(v => /^https?:\/\//i.test(v))]),
  description: longText.min(1),
}).superRefine(checkLocation);
export const jobSchema = z.object({
  title: text, industry: text, provinceCode, wardCode, addressDetail,
  jobType: z.enum(['Full-time', 'Part-time', 'Remote', 'Thực tập Toàn thời gian', 'Thực tập Bán thời gian']),
  minSalary: z.number().int().min(0).max(2147483647), maxSalary: z.number().int().min(0).max(2147483647),
  skills, description: longText.min(1), requirements: longText.min(1), benefits: longText.min(1),
  quota: z.number().int().min(1).max(100000),
  deadline: z.union([z.literal(''), z.iso.date()]).optional(),
  isFeatured: z.boolean().optional(), isHot: z.boolean().optional(),
}).superRefine(checkLocation).refine(v => v.maxSalary >= v.minSalary, 'Mức trợ cấp tối đa phải lớn hơn hoặc bằng mức tối thiểu.');
