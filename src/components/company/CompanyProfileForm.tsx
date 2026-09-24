'use client';

import { useT } from '@/context/LocaleContext';

import { useState } from 'react';
import { Building2, ImagePlus, Save, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { Button, Input } from '@/components/ui';

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

  return <div className="company-page"><div className="im-container"><section className="company-page-heading"><div className="company-heading-icon" aria-hidden="true"><Building2 size={22} /></div><div><p className="company-kicker">{t("Doanh nghiệp")}</p><h1>{t("Hồ sơ doanh nghiệp")}</h1><p>{t("Cập nhật thông tin để ứng viên hiểu rõ hơn về môi trường làm việc của bạn.")}</p></div></section><form className="company-form-shell" onSubmit={handleSubmit}><section className="company-form-section"><div className="company-section-heading"><div><h2>{t("Thông tin nhận diện")}</h2><p>{t("Thông tin này được hiển thị trên tin tuyển dụng và hồ sơ công ty.")}</p></div><div className="company-logo-preview" aria-label={t("Logo doanh nghiệp")}>{form.logoUrl ? <Image src={form.logoUrl} alt={t("Logo doanh nghiệp")} width={64} height={64} unoptimized /> : <span>{(form.companyName || 'I')[0].toUpperCase()}</span>}</div></div><div className="company-form-grid"><Input label={t("Tên doanh nghiệp")} value={form.companyName} onChange={(event) => update('companyName', event.target.value)} required /><Input label={t("Mã số thuế")} value={form.taxCode} onChange={(event) => update('taxCode', event.target.value)} required /><Input label={t("Lĩnh vực hoạt động")} value={form.industry} onChange={(event) => update('industry', event.target.value)} required /><Input label={t("Quy mô nhân sự")} value={form.companySize} onChange={(event) => update('companySize', event.target.value)} placeholder={t("Ví dụ: 50–200 nhân viên")} required /></div><label className="company-file-input"><ImagePlus size={18} aria-hidden="true" /><span>{form.logoUrl ? t("Đổi logo doanh nghiệp") : t("Tải logo doanh nghiệp")}</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleLogoChange(event.target.files?.[0])} /></label><p className="ui-hint">{t("PNG, JPG hoặc WEBP, tối đa 5 MB.")}</p></section><section className="company-form-section"><div className="company-section-heading"><div><h2>{t("Thông tin liên hệ")}</h2><p>{t("Giúp ứng viên xác định đúng địa điểm và kênh liên hệ với doanh nghiệp.")}</p></div></div><div className="company-form-grid"><Input label={t("Email tuyển dụng")} type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required /><Input label="Hotline" value={form.hotline} onChange={(event) => update('hotline', event.target.value)} required /><Input label={t("Địa chỉ")} value={form.address} onChange={(event) => update('address', event.target.value)} required /><Input label={t("Tỉnh / Thành phố")} value={form.city} onChange={(event) => update('city', event.target.value)} required /><Input label="Website" type="url" value={form.website} onChange={(event) => update('website', event.target.value)} placeholder="https://" /></div></section><section className="company-form-section"><label className="ui-label" htmlFor="company-description">{t("Giới thiệu doanh nghiệp")} <span className="ui-required">*</span></label><textarea id="company-description" className="ui-textarea company-textarea" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder={t("Mô tả ngắn về sản phẩm, văn hóa và môi trường làm việc...")} required /></section><div className="company-form-actions">{error && <span className="ui-error" role="alert">{t(error)}</span>}{saved ? <span className="company-save-message">{t("Đã lưu thông tin doanh nghiệp.")}</span> : null}<Button type="submit" loading={busy}><Save size={17} /> {t("Lưu hồ sơ")}</Button></div></form></div></div>;
}
