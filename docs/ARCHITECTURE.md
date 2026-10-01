# Kiến trúc InternMatch

> Tài liệu thiết kế cho phạm vi đã chốt. Phạm vi sản phẩm chỉ gồm các chức năng trong `docs/SPECIFICATIONS.md` và giao diện trong `docs/mockups/`. Không mở rộng thêm tính năng ngoài tài liệu này.

## 1. Nguyên tắc phạm vi

- Mockup là nguồn chuẩn cho giao diện, bố cục, nội dung hiển thị và responsive behavior.
- `docs/SPECIFICATIONS.md` là nguồn chuẩn cho chức năng và điều kiện bàn giao.
- Không thêm chat trực tiếp, thanh toán online, admin dashboard riêng, AI matching nâng cao, email campaign hoặc tính năng ngoài phạm vi đặc tả.
- Matching trong phạm vi sản phẩm chỉ là gợi ý việc làm dựa trên kỹ năng; dùng cách tính điểm xác định, không cần mô hình AI.
- Các route công khai giữ đúng route trong đặc tả hiện tại.

## 2. Kiến trúc tổng thể

Chọn **Modular Monolith** trên Next.js App Router.

```text
Next.js App Router
├── Presentation: routes, layouts, shared UI
├── Feature modules
│   ├── auth
│   ├── student
│   ├── company
│   ├── jobs
│   ├── applications
│   └── matching
├── Server Actions: mutations và nghiệp vụ nội bộ
├── Route Handlers: chỉ dùng cho endpoint cần thiết
└── Supabase: Auth, PostgreSQL, Storage
```

Không tách microservices ở phiên bản này. Một ứng dụng và một database phù hợp với phạm vi, thời gian và cách triển khai trên Vercel.

## 3. Tech stack đã chọn

| Lớp | Công nghệ | Vai trò |
| --- | --- | --- |
| Web framework | Next.js 16 App Router | Routing, SSR/RSC, server mutations |
| UI | React 19 + TypeScript strict | Component và type safety |
| Styling | Tailwind CSS 4 | Responsive mobile-first theo mockup |
| UI primitives | Shared UI components + Lucide React | Form control, dialog, dropdown, icons |
| Authentication | Supabase Auth | Đăng ký email thật, đăng nhập email/username legacy, recovery PKCE, đăng xuất |
| Database | Supabase PostgreSQL | Hồ sơ, doanh nghiệp, job, application |
| File storage | Supabase Storage | CV, ảnh đại diện, logo doanh nghiệp |
| Data access | `@supabase/ssr` + domain types/mappers | Truy cập an toàn từ Server/Client Components |
| Form validation | React forms + Zod | Form và validation phía server/client |
| Mutations | Next.js Server Actions | Tạo job, cập nhật hồ sơ, ứng tuyển |
| i18n | LocaleContext + dictionary + locale cookie | Tiếng Việt và English, không đổi public route |
| Deploy | Vercel + Supabase | Môi trường production |
| Test | Supabase integration checks + Playwright | Unit logic và các user flow chính |

## 4. Route map

| Route | Vai trò | Màn hình |
| --- | --- | --- |
| `/` | Public | Trang chủ, hero, search, giải pháp, job nổi bật, CTA |
| `/login` | Public | Đăng nhập bằng email thật hoặc username legacy |
| `/register` | Public | Đăng ký email thật, họ tên/tên công ty, mật khẩu và xác nhận theo role |
| `/forgot-password` | Public | Yêu cầu email khôi phục mật khẩu |
| `/reset-password` | Public | Hoàn tất đặt mật khẩu mới từ recovery PKCE |
| `/auth/callback` | Public | Nhận recovery PKCE callback, sau đó chuyển tới luồng reset an toàn |
| `/jobs` | Public | Danh sách việc làm, tìm kiếm và bộ lọc |
| `/jobs/[id]` | Public/Student | Chi tiết việc làm và ứng tuyển |
| `/student/profile` | Student | Hồ sơ thực tập sinh, CV, kỹ năng |
| `/student/dashboard` | Student | Tóm tắt hồ sơ, lịch sử ứng tuyển, việc phù hợp |
| `/company/profile` | Company | Hồ sơ doanh nghiệp |
| `/company/dashboard` | Company | Thống kê, job đã đăng, ứng viên |
| `/company/jobs/create` | Company | Đăng tin tuyển dụng |

## 5. Mô hình dữ liệu tối thiểu

### `profiles`

- `id` — liên kết `auth.users.id`
- `role` — `STUDENT` hoặc `COMPANY`
- `name`, `username`
- `email`
- `avatar_url`

### `student_profiles`

- `user_id`
- `university`
- `major`
- `expected_graduation_year`
- `gpa`
- `skills`
- `goals`
- `cv_url`

### `company_profiles`

- `user_id`
- `company_name`
- `tax_code`
- `industry`
- `company_size`
- `email`
- `hotline`
- `province_code`, `ward_code` — mã tỉnh/thành phố (2 số) và xã/phường (5 số)
- `address_detail` — địa chỉ cụ thể do người dùng nhập
- `address` — nhãn hiển thị, server sinh từ `ward_code` + `address_detail`
- `city` — nhãn hiển thị, server sinh từ `province_code`
- `website`
- `logo_url`
- `description`

### `jobs`

- `id`
- `company_id`
- `title`
- `industry`
- `job_type`
- `province_code`, `ward_code` — mã tỉnh/thành phố (2 số) và xã/phường (5 số)
- `address_detail` — địa chỉ cụ thể (tòa nhà, số nhà)
- `location` — nhãn hiển thị, server sinh từ `ward_code` + `province_code`
- `min_salary`
- `max_salary`
- `skills`
- `description`
- `requirements`
- `benefits`
- `is_featured`
- `quota`, `deadline`
- `created_at`

### `applications`

- `id`
- `job_id`
- `student_id`
- `cover_letter`
- `cv_url`
- `status` — `PENDING`, `REVIEWED`, `ACCEPTED`, `REJECTED`
- `applied_at`

### Đơn vị hành chính

`src/data/vn-divisions.json` chứa 34 tỉnh/thành phố và 3.321 đơn vị cấp xã theo mô hình
hai cấp có hiệu lực từ 01/07/2025, theo danh sách hành chính của Cục Thống kê (Phường
709 · Xã 2.599 · Đặc khu 13). Đây là nguồn dữ liệu duy nhất trong repo — không có file sinh
tự động và không lưu bản workbook gốc. Mỗi tỉnh có `code` (2 số), `name` (tên ngắn),
`nameEn`, `fullName` (có tiền tố "Tỉnh"/"Thành phố"); mỗi xã có `code` (5 số), `name`,
`nameEn`, `fullName` và `level` (`Phường` / `Xã` / `Đặc khu`) theo cột "Cấp". Mọi nơi ghi
địa chỉ đều theo chuỗi tỉnh/thành phố → xã/phường/đặc khu → địa chỉ cụ thể.

Khi sửa file này: mã tỉnh 2 số, mã xã 5 số, `fullName` = `<level> + " " + name`, danh sách
xã sắp theo cấp rồi theo tên (thứ tự tiếng Việt), và mã mới phải có `nameEn`. Tên trong
file là dạng NFC, không có khoảng trắng thừa.

- `src/lib/vn-divisions.ts` (server-only): tra cứu và sinh nhãn hiển thị; chỉ dùng ở server action, validation và route handler.
- `src/app/api/divisions/route.ts`: trả 34 tỉnh, hoặc xã/phường của một tỉnh khi có `?province=<code>`, để picker tải theo nhu cầu thay vì nạp cả dataset vào bundle.
- `src/components/ui/VnAddressFields.tsx`: combobox shadcn (`Popover` + `Command`) cho cả form nhập lẫn bộ lọc. `VnDivisionCombobox` là một ô, `VnLocationFilter` là bộ lọc hai ô ở `/jobs`, `VnLocationPicker` là một ô hai tầng dùng ở hero trang chủ.
- Danh sách xã nhóm theo `level` (Phường / Xã / Đặc khu) kèm số lượng; ô tìm kiếm khớp cả `name`, `nameEn` và `fullName` nên gõ "thành phố Hà Nội" hay "đặc khu Côn Đảo" đều ra.
- Cột `province_code` / `ward_code` là nguồn sự thật; `location`, `city`, `address` là nhãn hiển thị do server sinh lại từ mã.

## 6. Quy tắc phân quyền

- Sinh viên chỉ cập nhật hồ sơ và xem lịch sử ứng tuyển của chính mình.
- Doanh nghiệp chỉ cập nhật company profile và job do mình tạo.
- Doanh nghiệp chỉ xem ứng viên của các job thuộc doanh nghiệp mình.
- Sinh viên chỉ có thể ứng tuyển khi đã đăng nhập.
- Tin đã tạo được xem công khai; đơn mới chỉ được nhận trước hạn.
- Dùng Supabase Row Level Security làm lớp bảo vệ chính; UI không được xem là lớp bảo mật.

Route guard theo role được thực hiện tại `src/proxy.ts` trước khi truy cập khu vực Student/Company. Unauthenticated user được chuyển về login; chỉ internal `next` an toàn được giữ lại để tránh open redirect.

## 7. Matching trong phạm vi hợp đồng

Matching dùng điểm xác định:

```text
matching_score = số kỹ năng của job xuất hiện trong hồ sơ sinh viên
                 / tổng số kỹ năng job yêu cầu
```

Kết quả chỉ dùng cho khu vực “Gợi ý việc làm phù hợp” trên dashboard sinh viên. Không xây dựng AI pipeline, vector database hoặc hệ thống recommendation riêng.

## 8. Mapping với mockup

12 mockup trong `docs/mockups/` là bộ màn hình duy nhất cần thiết:

1. Đăng nhập
2. Tạo tài khoản mới
3. CTA khởi động sự nghiệp
4. Hero kết nối tài năng với doanh nghiệp
5. Giải pháp cho doanh nghiệp và sinh viên
6. Vị trí thực tập nổi bật
7. Hồ sơ thực tập sinh
8. Dashboard thực tập sinh
9. Dashboard doanh nghiệp
10. Form đăng tin — thông tin yêu cầu/quyền lợi
11. Hồ sơ doanh nghiệp
12. Form đăng tin — thông tin cơ bản

Không tạo thêm dashboard admin, màn hình chat, thanh toán hoặc quy trình ngoài các màn hình trên.

## 9. Bảng màu thương hiệu (Christmas Mulled Wine)

Toàn bộ màu thương hiệu nằm trong `src/app/globals.css` dưới dạng token; không hardcode hex trong component.

| Token | Mã màu | Vai trò |
| --- | --- | --- |
| `--wine-800` | `#3E0C1E` | Nền panel tối, chữ nhấn mạnh (`--accent-strong`) |
| `--wine-700` | `#6E0D27` | Trạng thái hover của nút chính (`--accent-hover`) |
| `--wine-600` | `#9D0D2F` | Màu thương hiệu chính (`--accent`, `--primary`) |
| `--wine-500` | `#B4204A` | Nhấn mạnh, badge nổi bật |
| `--wine-400` | `#E87D87` | Viền và highlight trên nền tối |
| `--wine-300` | `#ECA59D` | Chữ nhấn trên nền tối |
| `--wine-200` | `#E7C3CB` | Viền badge mềm (`--accent-border`) |
| `--wine-50` | `#FAF3F4` | Nền nhạt cho chip, badge, hover (`--accent-soft`) |

- Ramp này được expose sang Tailwind qua `@theme inline` nên dùng được `bg-wine-600`, `text-wine-300`, `border-wine-200`…
- Màu trạng thái `--success`, `--warning`, `--danger` giữ nguyên vì mang ý nghĩa trạng thái, không thuộc bảng màu thương hiệu.
- Trung tính (`--background`, `--surface-subtle`, `--muted`, `--border`) dùng sắc ấm để hòa với tông rượu vang.
- Logo `public/brand/internmatch-logo.png` (và bản icon `src/app/icon.png`) đã chuyển sang tông rượu vang; nếu khách gửi file gốc mới thì thay thế trực tiếp, không cần sửa code.

## 10. Ranh giới giữa prototype và sản phẩm thật

- Mock data và `localStorage` chỉ có thể dùng trong prototype giao diện.
- Sản phẩm thật dùng Supabase Auth, PostgreSQL, Storage và RLS.
- Không thay đổi source-of-truth của Contract/Mockups để bổ sung tính năng mới.
- Đã triển khai backend và apply migration. Xem `HANDOVER.md` để vận hành.
