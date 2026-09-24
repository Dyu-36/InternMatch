import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(min: number, max: number): string {
  const formatNum = (n: number) => n.toLocaleString('vi-VN');
  return `${formatNum(min)} – ${formatNum(max)} VNĐ/tháng`;
}

export function calculateSkillMatch(studentSkills: string[], jobSkills: string[]): number {
  if (!jobSkills || jobSkills.length === 0) return 100;
  if (!studentSkills || studentSkills.length === 0) return 0;

  const normalizedStudent = studentSkills.map((s) => s.trim().toLowerCase());
  const normalizedJob = jobSkills.map((s) => s.trim().toLowerCase());

  let matches = 0;
  for (const js of normalizedJob) {
    if (normalizedStudent.some((ss) => ss.includes(js) || js.includes(ss))) {
      matches++;
    }
  }

  return Math.round((matches / normalizedJob.length) * 100);
}
