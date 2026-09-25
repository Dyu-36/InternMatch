'use client';

import { useT } from '@/context/LocaleContext';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, FileText, ImagePlus, Loader2, Save, UserRound } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Textarea } from '@/components/shadcn/textarea';
import { Container } from '@/components/ui/Container';
import type { StudentProfile } from '@/types';

const graduationYears = Array.from({ length: 8 }, (_, index) => String(new Date().getFullYear() + index));

export default function StudentProfileForm() {
  const t = useT();
  const { currentUser, studentProfile, updateStudentProfile } = useApp();
  const [form, setForm] = useState<StudentProfile>(studentProfile);
  const [avatarPreview, setAvatarPreview] = useState(studentProfile.avatarUrl ?? '');
  const [avatarFileName, setAvatarFileName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File>();
  const [cvFileName, setCvFileName] = useState(studentProfile.cvFileName ?? '');
  const [cvFile, setCvFile] = useState<File>();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(studentProfile);
    setAvatarPreview(studentProfile.avatarUrl ?? '');
    setCvFileName(studentProfile.cvFileName ?? '');
  }, [studentProfile]);

  const updateField = <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => { setSaved(false); setForm((current) => ({ ...current, [field]: value })); };
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; setAvatarFile(file); setAvatarFileName(file.name); const reader = new FileReader(); reader.onload = () => { const value = typeof reader.result === 'string' ? reader.result : ''; setAvatarPreview(value); updateField('avatarUrl', value); }; reader.readAsDataURL(file); };
  const handleCvChange = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; setCvFile(file); setCvFileName(file.name); updateField('cvFileName', file.name); };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setBusy(true); setError(''); setSaved(false); try { await updateStudentProfile({ ...form, fullName: form.fullName.trim(), university: form.university.trim(), major: form.major.trim(), skills: form.skills.map((skill) => skill.trim()).filter(Boolean), goals: form.goals.trim(), cvFileName, avatarUrl: avatarPreview, expectedGraduationYear: Number(form.expectedGraduationYear), gpa: Number(form.gpa) }, { avatarFile, cvFile }); setAvatarFile(undefined); setCvFile(undefined); setSaved(true); } catch (e) { setError(e instanceof Error ? e.message : 'Không thể lưu hồ sơ.'); } finally { setBusy(false); } };

  if (!currentUser || currentUser.role !== 'STUDENT') return <main className="student-page"><Container><div className="student-guard ui-card"><UserRound size={28} aria-hidden="true" /><h1>{t("Đăng nhập để cập nhật hồ sơ")}</h1><p>{t("Hồ sơ thực tập sinh giúp doanh nghiệp hiểu rõ hơn về bạn.")}</p><Link className="ui-button ui-button-primary" href="/login?next=/student/profile">{t("Đăng nhập")}</Link></div></Container></main>;

  return <main className="student-page"><Container><section className="student-form-shell"><div className="student-page-heading"><div><span className="student-heading-icon"><UserRound size={24} aria-hidden="true" /></span><h1>{t("Hồ sơ thực tập sinh")}</h1><p>{t("Cập nhật thông tin đầy đủ để tăng độ tin cậy và cơ hội kết nối thành công.")}</p></div><Link className="ui-button ui-button-secondary" href="/student/dashboard"><ArrowLeft size={17} aria-hidden="true" /> {t("Về Dashboard")}</Link></div><form className="student-profile-form" onSubmit={handleSubmit}><div className="student-form-grid">
  <div className="grid gap-2"><Label htmlFor="student-full-name">{t("Họ và tên")}</Label><Input id="student-full-name" value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="avatar">{t("Ảnh đại diện")}</Label><Label className="student-file-input cursor-pointer" htmlFor="avatar"><ImagePlus size={18} aria-hidden="true" /><span>{avatarFileName || (avatarPreview ? t("Đã có ảnh đại diện") : t("Chọn ảnh"))}</span><input id="avatar" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatarChange} /></Label>{avatarPreview ? <Image className="student-avatar-preview" src={avatarPreview} alt={t("Ảnh đại diện xem trước")} width={54} height={54} unoptimized /> : null}</div>
  <div className="grid gap-2"><Label htmlFor="student-university">{t("Trường Đại học / Viện đào tạo")}</Label><Input id="student-university" value={form.university} onChange={(event) => updateField('university', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="student-major">{t("Chuyên ngành")}</Label><Input id="student-major" value={form.major} onChange={(event) => updateField('major', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="graduation-year">{t("Năm tốt nghiệp dự kiến")}</Label><Select value={String(form.expectedGraduationYear)} onValueChange={(value) => updateField('expectedGraduationYear', Number(value))}><SelectTrigger id="graduation-year" className="w-full"><SelectValue placeholder={t("Chọn năm tốt nghiệp")} /></SelectTrigger><SelectContent>{graduationYears.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent></Select></div>
  <div className="grid gap-2"><Label htmlFor="student-gpa">{t("Điểm GPA (Thang 4.0)")}</Label><Input id="student-gpa" type="number" min="0" max="4" step="0.01" value={form.gpa} onChange={(event) => updateField('gpa', Number(event.target.value))} required /></div>
</div>
<div className="grid gap-2"><Label htmlFor="skills">{t("Kỹ năng chuyên môn (cách nhau bởi dấu phẩy)")}</Label><Input id="skills" required value={form.skills.join(', ')} onChange={(event) => updateField('skills', event.target.value.split(','))} placeholder={t("Ví dụ: Python, Django, PostgreSQL")} /><p className="text-xs text-muted-foreground">{t("Nhập các kỹ năng bạn muốn dùng để nhận gợi ý việc làm phù hợp.")}</p></div>
<div className="grid gap-2"><Label htmlFor="goals">{t("Mục tiêu & Giới thiệu bản thân")}</Label><Textarea id="goals" className="student-textarea" rows={5} value={form.goals} onChange={(event) => updateField('goals', event.target.value)} placeholder={t("Chia sẻ ngắn gọn về định hướng và mục tiêu thực tập của bạn.")} /></div>
<div className="student-cv-row"><div><p className="ui-label">{t("CV của bạn")}</p><p className="ui-hint">{t("PDF, DOC hoặc DOCX, tối đa 10 MB. Chỉ bạn và doanh nghiệp nhận đơn có thể xem CV.")}</p></div><Label className="student-file-input student-file-input--cv cursor-pointer" htmlFor="cv"><FileText size={18} aria-hidden="true" /><span>{cvFileName || t("Chọn file CV")}</span><input id="cv" type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} /></Label></div>
<div className="student-form-actions">{error && <span className="ui-error" role="alert">{t(error)}</span>}{saved ? <span className="student-save-message" role="status">{t("Đã lưu hồ sơ của bạn.")}</span> : null}<Button type="submit" size="lg" disabled={busy}>{busy ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t("Đang lưu…")}</> : <><Save size={17} aria-hidden="true" /> {t("Lưu hồ sơ")}</>}</Button></div></form></section></Container></main>;
}
