'use client';

import { useT } from '@/context/LocaleContext';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from "@/components/shadcn/button";
import { Label } from "@/components/shadcn/label";
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
    {!currentUser ? <><p className="mt-2 text-sm text-[var(--muted)]">{t("Tạo hồ sơ để gửi thông tin đến nhà tuyển dụng.")}</p><Button asChild className="mt-5 w-full"><Link href="/register?role=STUDENT">{t("Tạo hồ sơ để ứng tuyển")}</Link></Button><Button asChild variant="outline" className="mt-2 w-full"><Link href={`/login?next=/jobs/${job.id}`}>{t("Đã có tài khoản? Đăng nhập")}</Link></Button></>
    : currentUser.role !== 'STUDENT' ? <p className="mt-3 text-sm">{t("Chỉ tài khoản thực tập sinh có thể ứng tuyển.")}</p>
    : applied ? <p className="mt-3 text-green-700" role="status">{t("Đã ứng tuyển. Theo dõi kết quả tại dashboard.")}</p>
    : expired ? <p className="mt-3">{t("Tin tuyển dụng đã hết hạn nhận hồ sơ.")}</p>
    : <form className="mt-4 grid gap-3" onSubmit={async event => {
      event.preventDefault(); setBusy(true); setError('');
      try { await applyForJob(job.id, letter); } catch (e) { setError(e instanceof Error ? e.message : t("Không thể ứng tuyển.")); } finally { setBusy(false); }
    }}><Label htmlFor="cover-letter">{t("Lời nhắn cho doanh nghiệp")}</Label><Textarea id="cover-letter" maxLength={5000} value={letter} onChange={e => setLetter(e.target.value)} rows={4} /><p id="cover-letter-description" className="text-xs text-muted-foreground">{t("Hồ sơ và CV hiện tại sẽ được gửi cùng đơn.")}</p>{error && <p id="cover-letter-error" className="text-sm text-destructive" role="alert">{t(error)}</p>}<Button type="submit" className="w-full" disabled={busy} aria-describedby={error ? "cover-letter-error cover-letter-description" : "cover-letter-description"}>{busy ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t("Đang gửi…")}</> : t("Ứng tuyển ngay")}</Button><Button asChild variant="outline" className="w-full"><Link href="/student/profile">{t("Cập nhật hồ sơ / CV")}</Link></Button></form>}
  </section>;
}
