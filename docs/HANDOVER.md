# Bàn giao InternMatch

## Tài khoản và sử dụng

Không có tài khoản demo hoặc dữ liệu mẫu trong production. Chọn **Tạo tài khoản**, chọn Thực tập sinh hoặc Doanh nghiệp, rồi tạo username và mật khẩu. Username gồm 3–32 chữ cái không dấu, số hoặc `_`, không phân biệt hoa thường. Mật khẩu tối thiểu 6 ký tự.

- **Sinh viên:** cập nhật họ tên, trường, chuyên ngành, GPA, năm tốt nghiệp, kỹ năng và giới thiệu. Upload ảnh PNG/JPG/WEBP tối đa 5 MB, CV PDF/DOC/DOCX tối đa 10 MB. Tìm việc, mở chi tiết, gửi lời nhắn và ứng tuyển. Theo dõi trạng thái tại dashboard.
- **Doanh nghiệp:** hoàn thiện hồ sơ và logo, tạo hoặc sửa tin, đặt hạn nhận hồ sơ và chỉ tiêu. Dashboard hiển thị ứng viên, thông tin học tập, kỹ năng và lời nhắn. Chọn **Xem CV**, sau đó mở liên kết để xem file. Thay đổi trạng thái Chờ xem / Đã xem / Đã nhận / Từ chối.
- **Ngôn ngữ:** nút EN/VI trên header; trên điện thoại mở menu trước. Lựa chọn được lưu bằng cookie. Nội dung do người dùng nhập giữ nguyên ngôn ngữ gốc.
- **Xóa tin:** cần xác nhận trong trình duyệt; các đơn của tin đó cũng bị xóa theo quan hệ database.

CV là file riêng tư. Chỉ chủ CV và doanh nghiệp nhận đúng đơn có quyền tạo URL xem trong 60 giây. Các URL đã cấp hết hiệu lực khi hết hạn. Avatar và logo là file công khai.

## Quản lý hạ tầng

- GitHub: `Dyu-36/InternMatch`, nhánh duy nhất `main`.
- Supabase: project `InternMatch`, ref `johsqcfalnqdbksenyjy`, Singapore.
- Vercel: project `internmatch`, team `duy-e198`.
- Cấu hình Vercel của app: `NEXT_PUBLIC_INTERNMATCH_SUPABASE_URL`, `NEXT_PUBLIC_INTERNMATCH_SUPABASE_PUBLISHABLE_KEY` và secret phía server `INTERNMATCH_SUPABASE_SECRET_KEY`. Hai biến `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` chỉ dùng làm giá trị dự phòng khi phát triển tại máy; integration Supabase trên Vercel có thể đặt chúng về project khác.
- Personal access token Supabase chỉ dùng để cấu hình hạ tầng; app không phụ thuộc token này.
- `SUPABASE_TEST_SERVICE_ROLE_KEY` chỉ dành cho chạy script QA có dọn dữ liệu. Không đặt biến này trong Vercel hoặc frontend.

Auth dùng username và mật khẩu ở giao diện. Backend map username thành địa chỉ nội bộ `${AUTH_EMAIL_DOMAIN}` (mặc định `internmatch.vercel.app`) để tương thích với Supabase Auth, với Confirm email đã tắt. Đây không phải email liên lạc và không có luồng tự đặt lại mật khẩu qua email. Khi cần hỗ trợ tài khoản, chủ project xử lý bằng Supabase Auth. Email tuyển dụng trong hồ sơ doanh nghiệp là thông tin liên hệ riêng.

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

Kiểm thử backend và UI dùng tài khoản thử riêng, dọn tài khoản/file trong `finally`. Chỉ chạy với project QA hoặc khi đã cho phép tạo dữ liệu thử:

```bash
# Set SUPABASE_TEST_SERVICE_ROLE_KEY in the current shell, never in source control.
pnpm qa:backend
pnpm exec playwright install chromium
pnpm qa:ui
```

Đặt `BASE_URL` để chạy smoke/UI test trên bản triển khai. Ảnh kiểm tra được ghi vào `qa-artifacts/` và không commit. Có thể thu hồi token quản lý đã dùng sau khi bàn giao; không xóa publishable key đang được app sử dụng.

## Migration

Hai migration đã được áp dụng và ghi nhận trong `supabase_migrations.schema_migrations`:

1. `20260924181500_initial_schema.sql`
2. `20260924190000_secure_backend.sql`

Với project mới, apply theo thứ tự. Với project hiện tại, chỉ chạy migration mới; không chạy lại migration đã ghi nhận. Schema có RLS, quyền update theo cột, trigger tạo profile, sao chép hồ sơ vào đơn và đồng bộ thông tin doanh nghiệp trên tin tuyển dụng.

Tài liệu kỹ thuật về cookie và refresh phiên: [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs).
