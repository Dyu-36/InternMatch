# Giai đoạn 7 — Visual QA

Checklist đã chạy lại trên bản tích hợp Supabase ngày 2026-09-24. Phạm vi chỉ bao gồm Contract và 12 mockup trong `docs/mockups/`.

## Kết quả kiểm tra tự động

| Hạng mục | Kết quả |
| --- | --- |
| `pnpm lint` | PASS — không còn lỗi hoặc warning |
| `pnpm build` | PASS — build production thành công |
| `pnpm qa:routes` | PASS — 11/11 route chính trả về HTTP 200 và không có error marker |
| Backend/Supabase | PASS — migration, Auth, RLS và Storage; 11 nhóm kiểm thử |

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

- [x] Desktop: bố cục, khoảng cách, typography và card không bị tràn.
- [x] Tablet: grid chuyển cột hợp lý, header không bị vỡ.
- [x] Mobile: menu, form, CTA và bảng ứng viên có thể thao tác bằng một tay.

### So sánh mockup

- [x] Mockup 01–02: login/register.
- [x] Mockup 03–06: landing page, CTA, solutions và featured jobs.
- [x] Mockup 07–08: student profile và student dashboard.
- [x] Mockup 09–12: company dashboard, job form, company profile và application form.

### Tương tác và trạng thái

- [x] Điều hướng header, footer và các CTA hoạt động đúng route.
- [x] Hover, focus và disabled state có độ tương phản rõ.
- [x] Required fields và validation hiển thị đúng thông báo.
- [x] Loading, empty, error và not-found state có CTA quay lại hợp lý.
- [x] Auth thật, upload ảnh/logo/CV, ứng tuyển và cập nhật trạng thái hoạt động với Supabase.

## Ghi chú phạm vi

Đã đối chiếu ảnh chụp với 12 mockup: giữ cấu trúc màn hình, form và dashboard; cập nhật nội dung cho dữ liệu thật và thêm lựa chọn EN/VI. Chromium kiểm tra 11 route ở 1440px, 768px và 390px, không tràn ngang hoặc lỗi JavaScript. Ảnh lưu tại `qa-artifacts/` (không commit). Đã phát hiện và sửa CTA chữ trắng trên nền trắng.

Nghiệm thu cuối từ chủ sản phẩm vẫn có thể điều chỉnh các khác biệt thẩm mỹ nhỏ. Không thêm chat, thanh toán, admin hoặc AI nâng cao.