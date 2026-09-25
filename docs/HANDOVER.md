# Bàn giao InternMatch

## Tài khoản và sử dụng

Ứng dụng dùng dữ liệu thật trong production. Ngoài luồng đăng ký bằng email thật, project test/demo có bộ dữ liệu deterministic gồm 25 công ty, 100 tin tuyển dụng, 30 hồ sơ ứng viên hư cấu và 200 đơn ứng tuyển; chỉ chạy seed trên project test/demo. Tài khoản seed dùng email `.example` và mật khẩu ngẫu nhiên không dùng để đăng nhập. Xem lệnh plan/apply/purge tại `supabase/seed/README.md`.

- **Sinh viên:** cập nhật họ tên, trường, chuyên ngành, GPA, năm tốt nghiệp, kỹ năng và giới thiệu. Upload ảnh PNG/JPG/WEBP tối đa 5 MB, CV PDF/DOC/DOCX tối đa 10 MB. Tìm việc, mở chi tiết, gửi lời nhắn và ứng tuyển. Theo dõi trạng thái tại dashboard.
- **Doanh nghiệp:** hoàn thiện hồ sơ và logo, tạo hoặc sửa tin, đặt hạn nhận hồ sơ và chỉ tiêu. Dashboard hiển thị ứng viên, thông tin học tập, kỹ năng và lời nhắn. Chọn **Xem CV**, sau đó mở liên kết để xem file. Thay đổi trạng thái Chờ xem / Đã xem / Đã nhận / Từ chối.
- **Ngôn ngữ:** nút EN/VI trên header; trên điện thoại mở menu trước. Lựa chọn được lưu bằng cookie. Nội dung do người dùng nhập giữ nguyên ngôn ngữ gốc.
- **Xóa tin:** cần xác nhận trong trình duyệt; các đơn của tin đó cũng bị xóa theo quan hệ database.

CV là file riêng tư. Chỉ chủ CV và doanh nghiệp nhận đúng đơn có quyền tạo URL xem trong 60 giây. Các URL đã cấp hết hiệu lực khi hết hạn. Avatar và logo là file công khai.

## Quản lý hạ tầng

- GitHub: `Dyu-36/InternMatch`, nhánh duy nhất `main`.
- Supabase: project `InternMatch`, ref `johsqcfalnqdbksenyjy`, Singapore.
- Vercel: project `internmatch`, team `duy-e198`.
- Cấu hình Vercel của app: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_INTERNMATCH_SUPABASE_URL`, `NEXT_PUBLIC_INTERNMATCH_SUPABASE_PUBLISHABLE_KEY` và secret phía server `INTERNMATCH_SUPABASE_SECRET_KEY`. `NEXT_PUBLIC_SITE_URL` phải là public origin thực tế của production. Hai biến `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` chỉ dùng làm giá trị dự phòng khi phát triển tại máy; integration Supabase trên Vercel có thể đặt chúng về project khác.
- Personal access token Supabase chỉ dùng để cấu hình hạ tầng; app không phụ thuộc token này.
- `SUPABASE_TEST_SERVICE_ROLE_KEY` chỉ dành cho chạy script QA có dọn dữ liệu. Không đặt biến này trong Vercel hoặc frontend.

Auth mới dùng email thật cho đăng ký và recovery. Login nhận email thật hoặc username legacy; backend chỉ map username legacy thành địa chỉ tương thích `${username}@${AUTH_EMAIL_DOMAIN}` (mặc định `internmatch.vercel.app`). Địa chỉ này không phải email liên hệ và không được dùng cho tài khoản mới. Luồng quên/reset mật khẩu dùng Supabase PKCE, gửi link đến email thật rồi xử lý callback tại `/auth/callback`.

Trước khi vận hành từng môi trường, kiểm tra **Supabase → Authentication → URL Configuration**: **Site URL** phải khớp `NEXT_PUBLIC_SITE_URL`, và **Redirect URLs** phải chứa `<NEXT_PUBLIC_SITE_URL>/auth/callback`. Development dùng `http://localhost:3000`; production dùng public origin thực tế, không ghi cứng hoặc suy đoán URL production.

## Phát triển và kiểm tra

```bash
pnpm install --frozen-lockfile
# Copy .env.example to .env.local and fill in the public app key.
pnpm dev
pnpm lint
pnpm build
pnpm start
pnpm qa:routes
```

```bash
# Dữ liệu demo trên project test/demo; xem trước khi apply
pnpm seed:jobs:plan
pnpm seed:applicants:plan
pnpm seed:jobs
pnpm seed:applicants
```

Kiểm thử backend và UI dùng tài khoản thử riêng, dọn tài khoản/file trong `finally`. Chỉ chạy với project QA hoặc khi đã cho phép tạo dữ liệu thử:

```bash
# Set SUPABASE_TEST_SERVICE_ROLE_KEY in the current shell, never in source control.
pnpm qa:backend
pnpm exec playwright install chromium
pnpm qa:ui
```

Đặt `BASE_URL` để chạy smoke/UI test trên bản triển khai. Ảnh kiểm tra được ghi vào `qa-artifacts/` và không commit. Có thể thu hồi token quản lý đã dùng sau khi bàn giao; không xóa publishable key đang được app sử dụng.

## Migration

Ba migration theo thứ tự:

1. `20260924181500_initial_schema.sql`
2. `20260924190000_secure_backend.sql`
3. `20260925100000_application_avatar_snapshot.sql`

Với project mới, apply cả ba theo thứ tự. Với project hiện tại, chỉ chạy migration mới nếu nó chưa được ghi nhận trong `supabase_migrations.schema_migrations`; không chạy lại migration đã ghi nhận. Schema có RLS, quyền update theo cột, trigger tạo profile, sao chép hồ sơ (kể cả avatar) vào đơn và đồng bộ thông tin doanh nghiệp trên tin tuyển dụng.

Tài liệu kỹ thuật về cookie và refresh phiên: [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs).
