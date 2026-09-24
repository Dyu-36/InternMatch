# Giai đoạn 7 — Visual QA

Tài liệu này là checklist kiểm tra UI trước khi chuyển sang tích hợp Supabase. Phạm vi chỉ bao gồm Contract và 12 mockup trong `docs/mockups/`.

## Kết quả kiểm tra tự động

| Hạng mục | Kết quả |
| --- | --- |
| `pnpm lint` | PASS — không còn lỗi hoặc warning |
| `pnpm build` | PASS — build production thành công |
| `pnpm qa:routes` | PASS — 11/11 route chính trả về HTTP 200 và không có error marker |
| Backend/Supabase | Chưa thực hiện — chờ API và thông tin project |

## Route coverage

- `/`
- `/login`
- `/register`
- `/jobs`
- `/jobs/[id]`
- `/student/profile`
- `/student/dashboard`
- `/company/profile`
- `/company/dashboard`
- `/company/jobs/create`
- `/company/jobs/[id]`

## Checklist nghiệm thu giao diện

### Responsive

- [ ] Desktop: bố cục, khoảng cách, typography và card không bị tràn.
- [ ] Tablet: grid chuyển cột hợp lý, header không bị vỡ.
- [ ] Mobile: menu, form, CTA và bảng ứng viên có thể thao tác bằng một tay.

### So sánh mockup

- [ ] Mockup 01–02: login/register.
- [ ] Mockup 03–06: landing page, CTA, solutions và featured jobs.
- [ ] Mockup 07–08: student profile và student dashboard.
- [ ] Mockup 09–12: company dashboard, job form, company profile và application form.

### Tương tác và trạng thái

- [ ] Điều hướng header, footer và các CTA hoạt động đúng route.
- [ ] Hover, focus và disabled state có độ tương phản rõ.
- [ ] Required fields và validation hiển thị đúng thông báo.
- [ ] Loading, empty, error và not-found state có CTA quay lại hợp lý.
- [ ] Mock auth, localStorage, upload preview và cập nhật trạng thái ứng tuyển hoạt động trong demo.

## Ghi chú phạm vi

Visual sign-off cuối cùng cần được thực hiện trên desktop, tablet và mobile với bộ mockup gốc. Giai đoạn này không thêm chat, thanh toán, admin riêng, AI matching nâng cao hoặc backend thật.