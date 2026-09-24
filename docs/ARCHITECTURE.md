# Kiến trúc InternMatch

> Tài liệu thiết kế cho phạm vi đã chốt. Phạm vi sản phẩm chỉ gồm các chức năng trong `docs/Contract.md` và giao diện trong `docs/mockups/`. Không mở rộng thêm tính năng ngoài tài liệu này.

## 1. Nguyên tắc phạm vi

- Mockup là nguồn chuẩn cho giao diện, bố cục, nội dung hiển thị và responsive behavior.
- `docs/Contract.md` là nguồn chuẩn cho chức năng và điều kiện bàn giao.
- Không thêm chat trực tiếp, thanh toán online, admin dashboard riêng, AI matching nâng cao, email campaign hoặc tính năng ngoài phạm vi hợp đồng.
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
| UI primitives | shadcn/ui + Lucide React | Form control, dialog, dropdown, icons |
| Authentication | Supabase Auth | Đăng ký, đăng nhập, đăng xuất |
| Database | Supabase PostgreSQL | Hồ sơ, doanh nghiệp, job, application |
| File storage | Supabase Storage | CV, ảnh đại diện, logo doanh nghiệp |
| Data access | `@supabase/ssr` + generated types | Truy cập an toàn từ Server/Client Components |
| Form validation | React Hook Form + Zod | Form và validation phía server/client |
| Mutations | Next.js Server Actions | Tạo job, cập nhật hồ sơ, ứng tuyển |
| i18n | `next-intl` với locale prefix ẩn | Tiếng Việt và English, không đổi public route |
| Deploy | Vercel + Supabase | Môi trường production |
| Test | Vitest + Playwright | Unit logic và các user flow chính |

## 4. Route map

| Route | Vai trò | Màn hình |
| --- | --- | --- |
| `/` | Public | Trang chủ, hero, search, giải pháp, job nổi bật, CTA |
| `/login` | Public | Đăng nhập |
| `/register` | Public | Tạo tài khoản và chọn role |
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
- `full_name`
- `email`
- `avatar_url`

### `student_profiles`

- `user_id`
- `university`
- `major`
- `graduation_year`
- `gpa`
- `skills`
- `bio`
- `cv_url`

### `companies`

- `user_id`
- `company_name`
- `tax_code`
- `industry`
- `company_size`
- `email`
- `hotline`
- `address`
- `province`
- `website`
- `logo_url`
- `description`

### `jobs`

- `id`
- `company_id`
- `title`
- `category`
- `workplace_type`
- `location`
- `allowance_min`
- `allowance_max`
- `required_skills`
- `description`
- `requirements`
- `benefits`
- `is_featured`
- `status`
- `created_at`

### `applications`

- `id`
- `job_id`
- `student_id`
- `cover_letter`
- `cv_url`
- `status` — `PENDING`, `APPROVED`, `REJECTED`
- `applied_at`

## 6. Quy tắc phân quyền

- Sinh viên chỉ cập nhật hồ sơ và xem lịch sử ứng tuyển của chính mình.
- Doanh nghiệp chỉ cập nhật company profile và job do mình tạo.
- Doanh nghiệp chỉ xem ứng viên của các job thuộc doanh nghiệp mình.
- Sinh viên chỉ có thể ứng tuyển khi đã đăng nhập.
- Job ở trạng thái published được xem công khai.
- Dùng Supabase Row Level Security làm lớp bảo vệ chính; UI không được xem là lớp bảo mật.

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

## 9. Ranh giới giữa prototype và sản phẩm thật

- Mock data và `localStorage` chỉ có thể dùng trong prototype giao diện.
- Sản phẩm thật dùng Supabase Auth, PostgreSQL, Storage và RLS.
- Không thay đổi source-of-truth của Contract/Mockups để bổ sung tính năng mới.
- File này chỉ ghi nhận kiến trúc; chưa triển khai code hoặc thay đổi UI.
