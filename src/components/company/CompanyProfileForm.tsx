'use client';

import { useState } from 'react';
import { Building2, ImagePlus, Save, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { Button, Input } from '@/components/ui';

export default function CompanyProfileForm() {
  const { currentUser, companyProfile, updateCompanyProfile } = useApp();
  const [form, setForm] = useState(companyProfile);
  const [saved, setSaved] = useState(false);

  if (!currentUser || currentUser.role !== 'COMPANY') {
    return (
      <div className="company-page">
        <div className="im-container">
          <section className="company-guard ui-card">
            <ShieldCheck size={42} aria-hidden="true" />
            <h1>Hồ sơ doanh nghiệp</h1>
            <p>Vui lòng đăng nhập bằng tài khoản doanh nghiệp để chỉnh sửa thông tin.</p>
          </section>
        </div>
      </div>
    );
  }

  const update = (field: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setSaved(false);
  };

  const handleLogoChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update('logoUrl', String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateCompanyProfile(form);
    setSaved(true);
  };

  return (
    <div className="company-page">
      <div className="im-container">
        <section className="company-page-heading">
          <div className="company-heading-icon" aria-hidden="true"><Building2 size={22} /></div>
          <div>
            <p className="company-kicker">Doanh nghiệp</p>
            <h1>Hồ sơ doanh nghiệp</h1>
            <p>Cập nhật thông tin để ứng viên hiểu rõ hơn về môi trường làm việc của bạn.</p>
          </div>
        </section>

        <form className="company-form-shell" onSubmit={handleSubmit}>
          <section className="company-form-section">
            <div className="company-section-heading">
              <div>
                <h2>Thông tin nhận diện</h2>
                <p>Thông tin này được hiển thị trên tin tuyển dụng và hồ sơ công ty.</p>
              </div>
              <div className="company-logo-preview" aria-label="Logo doanh nghiệp">
                {form.logoUrl ? <Image src={form.logoUrl} alt="Logo doanh nghiệp" width={64} height={64} unoptimized /> : <span>{(form.companyName || 'I')[0].toUpperCase()}</span>}
              </div>
            </div>
            <div className="company-form-grid">
              <Input label="Tên doanh nghiệp" value={form.companyName} onChange={(event) => update('companyName', event.target.value)} required />
              <Input label="Mã số thuế" value={form.taxCode} onChange={(event) => update('taxCode', event.target.value)} required />
              <Input label="Lĩnh vực hoạt động" value={form.industry} onChange={(event) => update('industry', event.target.value)} required />
              <Input label="Quy mô nhân sự" value={form.companySize} onChange={(event) => update('companySize', event.target.value)} placeholder="Ví dụ: 50–200 nhân viên" required />
            </div>
            <label className="company-file-input">
              <ImagePlus size={18} aria-hidden="true" />
              <span>{form.logoUrl ? 'Đổi logo doanh nghiệp' : 'Tải logo doanh nghiệp'}</span>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleLogoChange(event.target.files?.[0])} />
            </label>
            <p className="ui-hint">PNG, JPG hoặc WEBP. Bản demo lưu ảnh trực tiếp trong trình duyệt.</p>
          </section>

          <section className="company-form-section">
            <div className="company-section-heading">
              <div>
                <h2>Thông tin liên hệ</h2>
                <p>Giúp ứng viên xác định đúng địa điểm và kênh liên hệ với doanh nghiệp.</p>
              </div>
            </div>
            <div className="company-form-grid">
              <Input label="Email tuyển dụng" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required />
              <Input label="Hotline" value={form.hotline} onChange={(event) => update('hotline', event.target.value)} required />
              <Input label="Địa chỉ" value={form.address} onChange={(event) => update('address', event.target.value)} required />
              <Input label="Tỉnh / Thành phố" value={form.city} onChange={(event) => update('city', event.target.value)} required />
              <Input label="Website" type="url" value={form.website} onChange={(event) => update('website', event.target.value)} placeholder="https://" />
            </div>
          </section>

          <section className="company-form-section">
            <label className="ui-label" htmlFor="company-description">Giới thiệu doanh nghiệp <span className="ui-required">*</span></label>
            <textarea id="company-description" className="ui-textarea company-textarea" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Mô tả ngắn về sản phẩm, văn hóa và môi trường làm việc..." required />
          </section>

          <div className="company-form-actions">
            {saved ? <span className="company-save-message">Đã lưu thông tin doanh nghiệp.</span> : null}
            <Button type="submit"><Save size={17} /> Lưu hồ sơ</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
