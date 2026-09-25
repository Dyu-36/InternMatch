'use client';

import { useT } from '@/context/LocaleContext';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Check, ChevronsUpDown, FileText, ImagePlus, Loader2, Save, UserRound } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/shadcn/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/shadcn/command';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select';
import { Textarea } from '@/components/shadcn/textarea';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';
import type { StudentProfile } from '@/types';

type SchoolOption = { id: string; code: string; name: string; type: string };
const graduationYears = Array.from({ length: 8 }, (_, index) => String(new Date().getFullYear() + index));

export default function StudentProfileForm() {
  const t = useT();
  const { currentUser, studentProfile, updateStudentProfile } = useApp();
  const [form, setForm] = useState<StudentProfile>(studentProfile);
  const [gpaInput, setGpaInput] = useState(String(studentProfile.gpa ?? ''));
  const [universityOpen, setUniversityOpen] = useState(false);
  const [universitySearch, setUniversitySearch] = useState('');
  const [schoolOptions, setSchoolOptions] = useState<SchoolOption[]>([]);
  const [schoolLoading, setSchoolLoading] = useState(false);
  const [schoolError, setSchoolError] = useState('');
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
    setGpaInput(String(studentProfile.gpa ?? ''));
    setAvatarPreview(studentProfile.avatarUrl ?? '');
    setCvFileName(studentProfile.cvFileName ?? '');
  }, [studentProfile]);

  useEffect(() => {
    if (!universityOpen) return;
    const query = universitySearch.trim();
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSchoolLoading(true); setSchoolError('');
      try {
        const endpoint = query ? `/api/schools?search=${encodeURIComponent(query)}` : '/api/schools';
        const response = await fetch(endpoint, { signal: controller.signal, cache: 'no-cache' });
        const payload = await response.json() as SchoolOption[] | { error?: string };
        if (!response.ok || !Array.isArray(payload)) throw new Error(!Array.isArray(payload) && payload.error ? payload.error : 'Không thể tải danh sách trường.');
        if (!controller.signal.aborted) setSchoolOptions(payload);
      } catch (fetchError) {
        if (!controller.signal.aborted) { setSchoolOptions([]); setSchoolError(fetchError instanceof Error ? fetchError.message : 'Không thể tải danh sách trường.'); }
      } finally { if (!controller.signal.aborted) setSchoolLoading(false); }
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [universityOpen, universitySearch]);

  const handleUniversitySearch = (value: string) => {
    setUniversitySearch(value);
    setSchoolOptions([]);
    setSchoolError('');
    setSchoolLoading(true);
  };

  const updateField = <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => { setSaved(false); setForm((current) => ({ ...current, [field]: value })); };
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; setAvatarFile(file); setAvatarFileName(file.name); const reader = new FileReader(); reader.onload = () => { const value = typeof reader.result === 'string' ? reader.result : ''; setAvatarPreview(value); updateField('avatarUrl', value); }; reader.readAsDataURL(file); };
  const handleCvChange = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; setCvFile(file); setCvFileName(file.name); updateField('cvFileName', file.name); };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError(''); setSaved(false);
    try {
      await updateStudentProfile({ ...form, fullName: form.fullName.trim(), university: form.university.trim(), major: form.major.trim(), skills: form.skills.map((skill) => skill.trim()).filter(Boolean), goals: form.goals.trim(), cvFileName, avatarUrl: avatarPreview, expectedGraduationYear: Number(form.expectedGraduationYear), gpa: gpaInput.trim() === '' ? 0 : Number(gpaInput) }, { avatarFile, cvFile });
      setAvatarFile(undefined); setCvFile(undefined); setSaved(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'Không thể lưu hồ sơ.'); } finally { setBusy(false); }
  };

  if (!currentUser || currentUser.role !== 'STUDENT') return <div className="student-page"><Container><div className="student-guard ui-card"><UserRound size={28} aria-hidden="true" /><h1>{t("Đăng nhập để cập nhật hồ sơ")}</h1><p>{t("Hồ sơ thực tập sinh giúp doanh nghiệp hiểu rõ hơn về bạn.")}</p><Button asChild><Link href="/login?next=/student/profile">{t("Đăng nhập")}</Link></Button></div></Container></div>;

  return <div className="student-page"><Container><section className="student-form-shell"><div className="student-page-heading"><div><span className="student-heading-icon"><UserRound size={24} aria-hidden="true" /></span><h1>{t("Hồ sơ thực tập sinh")}</h1><p>{t("Cập nhật thông tin đầy đủ để tăng độ tin cậy và cơ hội kết nối thành công.")}</p></div><Button asChild variant="outline"><Link href="/student/dashboard"><ArrowLeft size={17} aria-hidden="true" /> {t("Về Dashboard")}</Link></Button></div><form className="student-profile-form" onSubmit={handleSubmit}><div className="student-form-grid">
  <div className="grid gap-2"><Label htmlFor="student-full-name">{t("Họ và tên")}</Label><Input id="student-full-name" value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} required /></div>
  <div className="grid gap-2"><p className="text-sm font-medium leading-none">{t("Ảnh đại diện")}</p><Label className="student-file-input cursor-pointer"><ImagePlus size={18} aria-hidden="true" /><span>{avatarFileName || (avatarPreview ? t("Đã có ảnh đại diện") : t("Chọn ảnh"))}</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatarChange} /></Label>{avatarPreview ? <Image className="student-avatar-preview" src={avatarPreview} alt={t("Ảnh đại diện xem trước")} width={54} height={54} unoptimized /> : null}</div>
  <div className="grid gap-2"><Label htmlFor="student-university">{t("Trường Đại học / Viện đào tạo")}</Label><Popover open={universityOpen} onOpenChange={setUniversityOpen}><PopoverTrigger asChild><Button id="student-university" type="button" variant="outline" role="combobox" aria-expanded={universityOpen} aria-controls="university-options" className="h-11 w-full justify-between bg-white font-normal text-slate-950 hover:bg-white hover:text-slate-950 focus-visible:bg-white aria-expanded:bg-white aria-expanded:text-slate-950"><span className={cn("min-w-0 truncate", !form.university && 'text-slate-500')}>{form.university || t("Tìm và chọn trường")}</span><ChevronsUpDown className="size-4 opacity-50" aria-hidden="true" /></Button></PopoverTrigger><PopoverContent align="start" collisionPadding={8} className="w-[var(--radix-popover-trigger-width)] overflow-hidden bg-white p-0 text-slate-950" style={{ maxHeight: 'var(--radix-popover-content-available-height)' }}><Command shouldFilter={false} className="h-auto bg-white text-slate-950" style={{ maxHeight: 'calc(var(--radix-popover-content-available-height) - 2px)' }}><CommandInput aria-label={t("Gõ tên trường để tìm...")} placeholder={t("Gõ tên trường để tìm...")} value={universitySearch} onValueChange={handleUniversitySearch} /><CommandList id="university-options" className="min-h-0 max-h-72 flex-1 [scrollbar-gutter:stable]" aria-busy={schoolLoading}><CommandEmpty className="text-slate-700">{schoolLoading ? t("Đang tải danh sách trường...") : t(schoolError) || (!universitySearch.trim() ? t("Chưa có dữ liệu trường.") : t("Không tìm thấy trường phù hợp."))}</CommandEmpty>{schoolOptions.length > 0 ? <CommandGroup>{schoolOptions.map((school) => <CommandItem key={school.id} value={`${school.id}-${school.name}`} onSelect={() => { updateField('university', school.name); handleUniversitySearch(''); setUniversityOpen(false); }}><Check className={cn("size-4", form.university === school.name ? "opacity-100" : "opacity-0")} aria-hidden="true" /><span className="min-w-0 flex-1 whitespace-normal break-words">{school.name}</span>{school.code ? <span className="ml-auto shrink-0 text-xs text-muted-foreground">{school.code}</span> : null}</CommandItem>)}</CommandGroup> : null}</CommandList>{!schoolLoading && !schoolError && schoolOptions.length > 0 ? <div className="flex shrink-0 flex-wrap justify-between gap-x-3 border-t border-border px-3 py-2 text-xs text-slate-500"><span aria-live="polite">{t("Số trường tìm thấy:")} {schoolOptions.length}</span><span>{t("Cuộn để xem thêm")}</span></div> : null}</Command></PopoverContent></Popover>{schoolError ? <p className="text-sm text-destructive" role="alert">{t(schoolError)}</p> : null}</div>
  <div className="grid gap-2"><Label htmlFor="student-major">{t("Chuyên ngành")}</Label><Input id="student-major" value={form.major} onChange={(event) => updateField('major', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="graduation-year">{t("Năm tốt nghiệp dự kiến")}</Label><Select value={String(form.expectedGraduationYear)} onValueChange={(value) => updateField('expectedGraduationYear', Number(value))}><SelectTrigger id="graduation-year" className="w-full"><SelectValue placeholder={t("Chọn năm tốt nghiệp")} /></SelectTrigger><SelectContent>{graduationYears.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent></Select></div>
  <div className="grid gap-2"><Label htmlFor="student-gpa">{t("Điểm GPA (Thang 4.0)")}</Label><Input id="student-gpa" type="text" inputMode="decimal" placeholder="0 - 4.0" value={gpaInput} onChange={(event) => { setGpaInput(event.target.value); setSaved(false); }} required /></div>
</div>
<div className="grid gap-2"><Label htmlFor="skills">{t("Kỹ năng chuyên môn (cách nhau bởi dấu phẩm)")}</Label><Input id="skills" required aria-describedby="skills-description" value={form.skills.join(', ')} onChange={(event) => updateField('skills', event.target.value.split(','))} placeholder={t("Ví dụ: Python, Django, PostgreSQL")} /><p id="skills-description" className="text-xs text-muted-foreground">{t("Nhập các kỹ năng bạn muốn dùng để nhận gợi ý việc làm phù hợp.")}</p></div>
<div className="grid gap-2"><Label htmlFor="goals">{t("Mục tiêu & Giới thiệu bản thân")}</Label><Textarea id="goals" className="student-textarea" rows={5} value={form.goals} onChange={(event) => updateField('goals', event.target.value)} placeholder={t("Chia sẻ ngắn gọn về định hướng và mục tiêu thực tập của bạn.")} /></div>
<div className="student-cv-row"><div><p className="ui-label">{t("CV của bạn")}</p><p id="cv-description" className="ui-hint">{t("PDF, DOC hoặc DOCX, tối đa 10 MB. Chỉ bạn và doanh nghiệp nhận đơn có thể xem CV.")}</p></div><Label className="student-file-input student-file-input--cv cursor-pointer"><FileText size={18} aria-hidden="true" /><span>{cvFileName || t("Chọn file CV")}</span><input type="file" accept=".pdf,.doc,.docx" aria-describedby="cv-description" onChange={handleCvChange} /></Label></div>
<div className="student-form-actions">{error && <span className="ui-error" role="alert">{t(error)}</span>}{saved ? <span className="student-save-message" role="status">{t("Đã lưu hồ sơ của bạn.")}</span> : null}<Button type="submit" size="lg" disabled={busy} aria-busy={busy}>{busy ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t("Đang lưu…")}</> : <><Save size={17} aria-hidden="true" /> {t("Lưu hồ sơ")}</>}</Button></div></form></section></Container></div>;
}
