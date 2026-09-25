'use client';

import { useT } from '@/context/LocaleContext';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/shadcn/button';
import { Label } from '@/components/shadcn/label';
import { Textarea } from '@/components/shadcn/textarea';
import type { Job } from '@/types';

export function ApplyPanel({ job }: { job: Job }) {
  const t = useT();
  const { currentUser, applications, applyForJob } = useApp();
  const [letter, setLetter] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const applied = applications.some(a => a.jobId === job.id && a.studentId === currentUser?.id);
  const expired = job.deadline && job.deadline < new Date().toISOString().slice(0, 10);

  return <section className="ui-card p-6"><h2 className="text-lg font-extrabold">{t("Sẵn sàng ứng tuyển?")}</h2>
    {!currentUser ? <><p className="mt-2 text-sm text-[var(--muted)]">{t("Tạo hồ sơ để gửi thông tin đến nhà tuyển dụng.")}</p><Link href="/register?role=STUDENT" className="ui-button ui-button-primary ui-button-full mt-5">{t("Tạo hồ sơ để ứng tuyển")}</Link><Link href={`/login?next=/jobs/${job.id}`} className="ui-button ui-button-secondary ui-button-full mt-2">{t("Đã có tài khoản? Đăng nhập")}</Link></>
    : currentUser.role !== 'STUDENT' ? <p className="mt-3 text-sm">{t("Chỉ tài khoản thực tập sinh có thể ứng tuyển.")}</p>
    : applied ? <p className="mt-3 text-green-700" role="status">{t("Đã ứng tuyển. Theo dõi kết quả tại dashboard.")}</p>
    : expired ? <p className="mt-3">{t("Tin tuyển dụng đã hết hạn nhận hồ sơ.")}</p>
    : <form className="mt-4 grid gap-3" onSubmit={async event => {
      event.preventDefault(); setBusy(true); setError('');
      try { await applyForJob(job.id, letter); } catch (e) { setError(e instanceof Error ? e.message : t("Không thể ứng tuyển.")); } finally { setBusy(false); }
    }}><Label htmlFor="cover-letter">{t("Lời nhắn cho doanh nghiệp")}</Label><Textarea id="cover-letter" maxLength={5000} value={letter} onChange={e => setLetter(e.target.value)} rows={4} /><p className="text-xs text-muted-foreground">{t("Hồ sơ và CV hiện tại sẽ được gửi cùng đơn.")}</p>{error && <p className="text-sm text-destructive" role="alert">{t(error)}</p>}<Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700" disabled={busy}>{busy ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t("Đang gửi…")}</> : t("Ứng tuyển ngay")}</Button><Link href="/student/profile" className="ui-button ui-button-secondary ui-button-full">{t("Cập nhật hồ sơ / CV")}</Link></form>}
  </section>;
}
