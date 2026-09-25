# InternMatch

Nền tảng kết nối sinh viên/thực tập sinh với doanh nghiệp tuyển dụng.

InternMatch hỗ trợ sinh viên tìm kiếm cơ hội thực tập, xây dựng hồ sơ và ứng tuyển; đồng thời giúp doanh nghiệp đăng tin tuyển dụng và quản lý ứng viên.

## Phạm vi sản phẩm

Sản phẩm được xây dựng theo phạm vi trong [Contract](./docs/Contract.md) và giao diện trong [docs/mockups](./docs/mockups).

### Sinh viên / Thực tập sinh

- Đăng ký, đăng nhập và đăng xuất
- Cập nhật hồ sơ cá nhân
- Upload ảnh đại diện và CV
- Nhập trường, chuyên ngành, GPA, năm tốt nghiệp và kỹ năng
- Xem dashboard cá nhân
- Xem lịch sử ứng tuyển
- Nhận gợi ý việc làm dựa trên kỹ năng
- Xem chi tiết và ứng tuyển vào vị trí thực tập

### Doanh nghiệp

- Đăng ký, đăng nhập và đăng xuất
- Cập nhật hồ sơ doanh nghiệp
- Quản lý thông tin công ty và logo
- Đăng tin tuyển dụng
- Chỉnh sửa và quản lý tin đã đăng
- Xem danh sách ứng viên
- Xem hồ sơ ứng viên và xử lý đơn ứng tuyển

### Việc làm

- Danh sách việc làm
- Tìm kiếm theo vị trí và kỹ năng
- Lọc theo địa điểm
- Lọc theo hình thức làm việc
- Hiển thị ngành nghề, kỹ năng, trợ cấp và địa điểm
- Trang chi tiết việc làm
- Ứng tuyển dành cho sinh viên

## Route chính

| Route | Mô tả |
| --- | --- |
| `/` | Trang chủ |
| `/login` | Đăng nhập bằng email hoặc username legacy |
| `/register` | Đăng ký bằng email thật, mật khẩu và xác nhận mật khẩu |
| `/forgot-password` | Yêu cầu email khôi phục mật khẩu |
| `/reset-password` | Đặt mật khẩu mới sau khi mở link khôi phục |
| `/auth/callback` | Callback PKCE cho luồng khôi phục mật khẩu |
| `/jobs` | Danh sách việc làm |
| `/jobs/[id]` | Chi tiết việc làm |
| `/student/profile` | Hồ sơ thực tập sinh |
| `/student/dashboard` | Dashboard thực tập sinh |
| `/company/profile` | Hồ sơ doanh nghiệp |
| `/company/dashboard` | Dashboard doanh nghiệp |
| `/company/jobs/create` | Đăng tin tuyển dụng |
| `/company/jobs/[id]` | Chỉnh sửa tin tuyển dụng |

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Shared UI components
- Lucide React
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Zod
- React forms + server-side Zod validation
- Vercel

## Kiến trúc

InternMatch sử dụng kiến trúc **Modular Monolith**:

```text
Next.js App Router
├── Auth
├── Student
├── Company
├── Jobs
├── Applications
└── Matching
```

Chi tiết xem tại [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Bắt đầu phát triển

### Yêu cầu

- Node.js 20+
- pnpm 11+

### Cài đặt

```bash
pnpm install
```

### Cấu hình Supabase và Auth

Copy `.env.example` sang `.env.local`, điền publishable key và giữ `NEXT_PUBLIC_SITE_URL=http://localhost:3000` cho development. Ở production, đặt `NEXT_PUBLIC_SITE_URL` bằng public origin thực tế của ứng dụng; biến này là canonical origin dùng để tạo link khôi phục mật khẩu.

Tài khoản mới đăng ký bằng email thật, họ tên đầy đủ (sinh viên) hoặc tên công ty (doanh nghiệp), mật khẩu và xác nhận mật khẩu. Đăng nhập chấp nhận cả email thật và username của tài khoản legacy; username chỉ được map nội bộ qua `AUTH_EMAIL_DOMAIN` để tương thích, không dùng làm email của tài khoản mới.

Luồng quên mật khẩu gửi email khôi phục tới địa chỉ đăng ký và hoàn tất bằng PKCE. Trong Supabase Dashboard mở **Authentication → URL Configuration** và kiểm tra:

- **Site URL** dùng đúng giá trị production của `NEXT_PUBLIC_SITE_URL`.
- **Redirect URLs** có `<NEXT_PUBLIC_SITE_URL>/auth/callback`; ở development có `http://localhost:3000/auth/callback`.

Xem [hướng dẫn backend](./supabase/README.md).

### Chạy môi trường development

```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000).

### Seed dữ liệu demo

Chỉ chạy trên project Supabase test/demo. Lệnh `*:plan` không ghi dữ liệu; lệnh `seed:*` áp dụng dữ liệu. Bộ seed tạo 100 tin tuyển dụng, 30 hồ sơ ứng viên hư cấu và 200 đơn ứng tuyển. Không commit secret; xem [hướng dẫn seed](./supabase/seed/README.md) để biết purge và các tùy chọn đầy đủ.

```bash
pnpm seed:jobs:plan
pnpm seed:applicants:plan
pnpm seed:jobs
pnpm seed:applicants
```

### Kiểm tra code

```bash
pnpm lint
```

### Build production

```bash
pnpm build
pnpm start
```

### Smoke test route

Khi chạy app ở một terminal khác, dùng lệnh sau để kiểm tra nhanh toàn bộ route chính:

```bash
pnpm qa:routes
```

## Tài liệu

- [Đặc tả yêu cầu](./docs/SPECIFICATIONS.md)
- [Hợp đồng và phạm vi sản phẩm](./docs/Contract.md)
- [Kiến trúc và tech stack](./docs/ARCHITECTURE.md)
- [Mockups giao diện](./docs/mockups)

## Ngoài phạm vi

Các chức năng sau không thuộc phiên bản này:

- Chat trực tiếp
- Thanh toán online
- Admin dashboard riêng
- AI Matching nâng cao
- Email campaign
- Tính năng mới ngoài Contract

## Trạng thái

Đã tích hợp Supabase Auth, PostgreSQL, RLS, Storage và Server Actions. App sử dụng dữ liệu thật, hỗ trợ Tiếng Việt/English. Nhánh chính: `main`.

- [Tiến độ](./docs/PROGRESS.md)
- [Hướng dẫn bàn giao và vận hành](./docs/HANDOVER.md)
- [Kết quả QA](./docs/PHASE-7-VISUAL-QA.md)
