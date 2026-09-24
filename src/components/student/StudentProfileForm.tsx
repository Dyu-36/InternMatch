'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, FileText, ImagePlus, Save, UserRound } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { StudentProfile } from '@/types';

const graduationYears = Array.from({ length: 8 }, (_, index) => String(new Date().getFullYear() + index));

export default function StudentProfileForm() {
  const { currentUser, studentProfile, updateStudentProfile } = useApp();
  const [form, setForm] = useState<StudentProfile>(studentProfile);
  const [avatarPreview, setAvatarPreview] = useState(studentProfile.avatarUrl ?? '');
  const [avatarFileName, setAvatarFileName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File>();
  const [cvFileName, setCvFileName] = useState(studentProfile.cvFileName ?? '');
  const [cvFile, setCvFile] = useState<File>();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(studentProfile);
    setAvatarPreview(studentProfile.avatarUrl ?? '');
    setCvFileName(studentProfile.cvFileName ?? '');
  }, [studentProfile]);

  const updateField = <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => {
    setSaved(false);
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const value = typeof reader.result === 'string' ? reader.result : '';
      setAvatarPreview(value);
      updateField('avatarUrl', value);
    };
    reader.readAsDataURL(file);
  };

  const handleCvChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCvFile(file);
    setCvFileName(file.name);
    updateField('cvFileName', file.name);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateStudentProfile({
      ...form,
      fullName: form.fullName.trim(),
      university: form.university.trim(),
      major: form.major.trim(),
      skills: form.skills.map((skill) => skill.trim()).filter(Boolean),
      goals: form.goals.trim(),
      cvFileName,
      avatarUrl: avatarPreview,
      expectedGraduationYear: Number(form.expectedGraduationYear),
      gpa: Number(form.gpa),
    }, { avatarFile, cvFile });
    setAvatarFile(undefined);
    setCvFile(undefined);
    setSaved(true);
  };

  if (!currentUser) {
    return <main className="student-page"><Container><div className="student-guard ui-card"><UserRound size={28} aria-hidden="true" /><h1>Đăng nhập để cập nhật hồ sơ</h1><p>Hồ sơ thực tập sinh giúp doanh nghiệp hiểu rõ hơn về bạn.</p><Link className="ui-button ui-button-primary" href="/login?next=/student/profile">Đăng nhập</Link></div></Container></main>;
  }

  return (
    <main className="student-page">
      <Container>
        <section className="student-form-shell">
          <div className="student-page-heading"><div><span className="student-heading-icon"><UserRound size={24} aria-hidden="true" /></span><h1>Hồ sơ thực tập sinh</h1><p>Cập nhật thông tin đầy đủ để tăng độ tin cậy và cơ hội kết nối thành công.</p></div><Link className="ui-button ui-button-secondary" href="/student/dashboard"><ArrowLeft size={17} aria-hidden="true" /> Về Dashboard</Link></div>
          <form className="student-profile-form" onSubmit={handleSubmit}>
            <div className="student-form-grid">
              <Input label="Họ và tên" required value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} />
              <div className="ui-field"><label className="ui-label" htmlFor="avatar">Ảnh đại diện</label><label className="student-file-input" htmlFor="avatar"><ImagePlus size={18} aria-hidden="true" /><span>{avatarFileName || (avatarPreview ? 'Đã có ảnh đại diện' : 'Chọn ảnh')}</span><input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} /></label>{avatarPreview ? <Image className="student-avatar-preview" src={avatarPreview} alt="Ảnh đại diện xem trước" width={54} height={54} unoptimized /> : null}</div>
              <Input label="Trường Đại học / Viện đào tạo" required value={form.university} onChange={(event) => updateField('university', event.target.value)} />
              <Input label="Chuyên ngành" required value={form.major} onChange={(event) => updateField('major', event.target.value)} />
              <Select label="Năm tốt nghiệp dự kiến" required value={String(form.expectedGraduationYear)} options={graduationYears.map((year) => ({ value: year, label: year }))} onChange={(event) => updateField('expectedGraduationYear', Number(event.target.value))} />
              <Input label="Điểm GPA (Thang 4.0)" required type="number" min="0" max="4" step="0.01" value={form.gpa} onChange={(event) => updateField('gpa', Number(event.target.value))} />
            </div>
            <div className="ui-field"><label className="ui-label" htmlFor="skills">Kỹ năng chuyên môn (cách nhau bởi dấu phẩy) <span className="ui-required">*</span></label><input id="skills" className="ui-input" required value={form.skills.join(', ')} onChange={(event) => updateField('skills', event.target.value.split(','))} placeholder="Ví dụ: Python, Django, PostgreSQL" /><span className="ui-hint">Nhập các kỹ năng bạn muốn dùng để nhận gợi ý việc làm phù hợp.</span></div>
            <div className="ui-field"><label className="ui-label" htmlFor="goals">Mục tiêu &amp; Giới thiệu bản thân</label><textarea id="goals" className="ui-textarea student-textarea" rows={5} value={form.goals} onChange={(event) => updateField('goals', event.target.value)} placeholder="Chia sẻ ngắn gọn về định hướng và mục tiêu thực tập của bạn." /></div>
            <div className="student-cv-row"><div><p className="ui-label">CV của bạn</p><p className="ui-hint">CV sẽ được lưu riêng tư trong Supabase Storage.</p></div><label className="student-file-input student-file-input--cv" htmlFor="cv"><FileText size={18} aria-hidden="true" /><span>{cvFileName || 'Chọn file CV'}</span><input id="cv" type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} /></label></div>
            <div className="student-form-actions">{saved ? <span className="student-save-message" role="status">Đã lưu hồ sơ của bạn.</span> : null}<Button type="submit" size="lg"><Save size={17} aria-hidden="true" /> Lưu hồ sơ</Button></div>
          </form>
        </section>
      </Container>
    </main>
  );
}
