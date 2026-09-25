'use client';

import { useT } from '@/context/LocaleContext';

import { useState } from 'react';
import { Building2, ImagePlus, Loader2, Save, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Textarea } from '@/components/shadcn/textarea';

export default function CompanyProfileForm() {
  const t = useT();
  const { currentUser, companyProfile, updateCompanyProfile } = useApp();
  const [form, setForm] = useState(companyProfile);
  const [logoFile, setLogoFile] = useState<File>();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!currentUser || currentUser.role !== 'COMPANY') {
    return <div className="company-page"><div className="im-container"><section className="company-guard ui-card"><ShieldCheck size={42} aria-hidden="true" /><h1>{t("Hồ sơ doanh nghiệp")}</h1><p>{t("Vui lòng đăng nhập bằng tài khoản doanh nghiệp để chỉnh sửa thông tin.")}</p></section></div></div>;
  }

  const update = (field: keyof typeof form, value: string) => { setForm((previous) => ({ ...previous, [field]: value })); setSaved(false); };
  const handleLogoChange = (file?: File) => { if (!file) return; setLogoFile(file); const reader = new FileReader(); reader.onload = () => update('logoUrl', String(reader.result)); reader.readAsDataURL(file); };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setBusy(true); setError(''); setSaved(false); try { await updateCompanyProfile(form, { logoFile }); setLogoFile(undefined); setSaved(true); } catch (e) { setError(e instanceof Error ? e.message : 'Không thể lưu hồ sơ.'); } finally { setBusy(false); } };

  return <div className="company-page"><div className="im-container"><section className="company-page-heading"><div className="company-heading-icon" aria-hidden="true"><Building2 size={22} /></div><div><p className="company-kicker">{t("Doanh nghiệp")}</p><h1>{t("Hồ sơ doanh nghiệp")}</h1><p>{t("Cập nhật thông tin để ứng viên hiểu rõ hơn về môi trường làm việc của bạn.")}</p></div></section><form className="company-form-shell" onSubmit={handleSubmit}>
<section className="company-form-section"><div className="company-section-heading"><div><h2>{t("Thông tin nhận diện")}</h2><p>{t("Thông tin này được hiển thị trên tin tuyển dụng và hồ sơ công ty.")}</p></div><div className="company-logo-preview" aria-label={t("Logo doanh nghiệp")}>{form.logoUrl ? <Image src={form.logoUrl} alt={t("Logo doanh nghiệp")} width={64} height={64} unoptimized /> : <span>{(form.companyName || 'I')[0].toUpperCase()}</span>}</div></div><div className="company-form-grid">
  <div className="grid gap-2"><Label htmlFor="company-name">{t("Tên doanh nghiệp")}</Label><Input id="company-name" value={form.companyName} onChange={(event) => update('companyName', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="company-tax-code">{t("Mã số thuế")}</Label><Input id="company-tax-code" value={form.taxCode} onChange={(event) => update('taxCode', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="company-industry">{t("Lĩnh vực hoạt động")}</Label><Input id="company-industry" value={form.industry} onChange={(event) => update('industry', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="company-size">{t("Quy mô nhân sự")}</Label><Input id="company-size" value={form.companySize} onChange={(event) => update('companySize', event.target.value)} placeholder={t("Ví dụ: 50–200 nhân viên")} required /></div>
</div><Label className="company-file-input cursor-pointer"><ImagePlus size={18} aria-hidden="true" /><span>{form.logoUrl ? t("Đổi logo doanh nghiệp") : t("Tải logo doanh nghiệp")}</span><input type="file" accept="image/png,image/jpeg,image/webp" aria-describedby="company-logo-description" onChange={(event) => handleLogoChange(event.target.files?.[0])} /></Label><p id="company-logo-description" className="ui-hint">{t("PNG, JPG hoặc WEBP, tối đa 5 MB.")}</p></section>
<section className="company-form-section"><div className="company-section-heading"><div><h2>{t("Thông tin liên hệ")}</h2><p>{t("Giúp ứng viên xác định đúng địa điểm và kênh liên hệ với doanh nghiệp.")}</p></div></div><div className="company-form-grid">
  <div className="grid gap-2"><Label htmlFor="company-email">{t("Email tuyển dụng")}</Label><Input id="company-email" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="company-hotline">Hotline</Label><Input id="company-hotline" value={form.hotline} onChange={(event) => update('hotline', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="company-address">{t("Địa chỉ")}</Label><Input id="company-address" value={form.address} onChange={(event) => update('address', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="company-city">{t("Tỉnh / Thành phố")}</Label><Input id="company-city" value={form.city} onChange={(event) => update('city', event.target.value)} required /></div>
  <div className="grid gap-2"><Label htmlFor="company-website">Website</Label><Input id="company-website" type="url" value={form.website} onChange={(event) => update('website', event.target.value)} placeholder="https://" /></div>
</div></section>
<section className="company-form-section"><div className="grid gap-2"><Label htmlFor="company-description">{t("Giới thiệu doanh nghiệp")}</Label><Textarea id="company-description" className="company-textarea" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder={t("Mô tả ngắn về sản phẩm, văn hóa và môi trường làm việc...")} required /></div></section><div className="company-form-actions">{error && <span className="ui-error" role="alert">{t(error)}</span>}{saved ? <span className="company-save-message" role="status">{t("Đã lưu thông tin doanh nghiệp.")}</span> : null}<Button type="submit" disabled={busy} aria-busy={busy}>{busy ? <><Loader2 className="animate-spin" aria-hidden="true" /> {t("Đang lưu…")}</> : <><Save size={17} aria-hidden="true" /> {t("Lưu hồ sơ")}</>}</Button></div></form></div></div>;
}
