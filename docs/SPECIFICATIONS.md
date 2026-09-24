# TÀI LIỆU ĐẶC TẢ YÊU CẦU DỰ ÁN INTERNMATCH

## 1. Giới thiệu tổng quan
**InternMatch** là nền tảng kết nối trực tuyến thông minh giữa **Sinh viên / Thực tập sinh** và **Doanh nghiệp tuyển dụng**.
Mục tiêu là tối ưu hóa quá trình tìm kiếm cơ hội thực tập, giúp sinh viên sớm tiếp cận các vị trí thực tập phù hợp với kỹ năng và định hướng nghề nghiệp, đồng thời giúp doanh nghiệp dễ dàng tiếp cận nguồn nhân tài trẻ chất lượng.

---

## 2. Công nghệ & Kiến trúc hệ thống
- **Frontend / Framework**: Next.js 16 (React 19, App Router, TypeScript)
- **Styling**: Tailwind CSS (Mobile-First, Responsive Design)
- **Icons**: Lucide React
- **Quản lý dữ liệu**: Mock Database / In-Memory / Local Storage & SQLite (hỗ trợ chuyển đổi sang Prisma / Supabase / PostgreSQL khi cần)
- **Triển khai**: Tối ưu triển khai trên Vercel
- **Đa ngôn ngữ**: Hỗ trợ 2 ngôn ngữ (Tiếng Việt & Tiếng Anh)

---

## 3. Bản đồ các màn hình & Chức năng (Dựa trên 12 Mockup)

| STT | Mockup File | Tên màn hình / Phần | Tuyến đường (Route) | Mô tả chức năng chính |
|-----|-------------|---------------------|----------------------|-----------------------|
| 01 | `01_dang-nhap.jpg` | Đăng nhập | `/login` | Đăng nhập bằng Tên đăng nhập và Mật khẩu, liên kết quên mật khẩu & đăng ký |
| 02 | `02_tao-tai-khoan-moi.jpg` | Tạo tài khoản mới | `/register` | Đăng ký theo 2 vai trò: **Thực tập sinh** hoặc **Doanh nghiệp** |
| 03 | `03_cta-san-sang-khoi-dong-su-nghiep.jpg` | Khối CTA Footer | Trang chủ / Footer | Lời kêu gọi hành động cho cả Sinh viên & Doanh nghiệp, thông tin liên hệ |
| 04 | `04_hero-ket-noi-tai-nang-voi-doanh-nghiep.jpg` | Hero Section | `/` (Trang chủ) | Thanh tìm kiếm theo Vị trí/Kỹ năng, Địa điểm, Hình thức làm việc; Thống kê nhanh |
| 05 | `05_giai-phap-cho-doanh-nghiep-va-sinh-vien.jpg` | Giải pháp tối ưu | `/` (Trang chủ) | 3 giá trị cốt lõi: Thuật toán Matching Kỹ năng, Doanh nghiệp đã xác thực, Quản lý hồ sơ 1 chạm |
| 06 | `06_vi-tri-thuc-tap-noi-bat.jpg` | Vị trí Thực tập Nổi bật | `/` & `/jobs` | Danh sách thẻ công việc nổi bật, huy hiệu HOT, mức trợ cấp, địa điểm, tags kỹ năng |
| 07 | `07_ho-so-thuc-tap-sinh.jpg` | Hồ sơ Thực tập sinh | `/student/profile` | Chỉnh sửa Họ tên, Ảnh đại diện, Trường đại học, Chuyên ngành, Năm tốt nghiệp, GPA, Kỹ năng, Mục tiêu |
| 08 | `08_dashboard-thuc-tap-sinh.jpg` | Dashboard Thực tập sinh | `/student/dashboard` | Thông tin tóm tắt hồ sơ, Lịch sử đơn ứng tuyển, Gợi ý việc làm phù hợp (Matching AI) |
| 09 | `09_dashboard-doanh-nghiep.jpg` | Dashboard Doanh nghiệp | `/company/dashboard` | Thống kê (Tổng tin đăng, Hồ sơ nhận được, Chỉ tiêu), Danh sách tin tuyển dụng, Danh sách ứng viên |
| 10 | `10_form-dang-tin-tuyen-dung.jpg` | Đăng tin tuyển dụng (Phần 2) | `/company/jobs/create` | Yêu cầu ứng viên, Quyền lợi trợ cấp & Đào tạo, Tùy chọn Đánh dấu tin nổi bật, Nút Xuất bản tin |
| 11 | `11_ho-so-doanh-nghiep.jpg` | Hồ sơ Doanh nghiệp | `/company/profile` | Tên DN, Mã số thuế, Lĩnh vực, Quy mô, Email, Hotline, Địa chỉ, Tỉnh/Thành phố, Website, Logo, Giới thiệu |
| 12 | `12_form-dang-ky-tuyen-dung-thuc-tap.jpg` | Đăng tin tuyển dụng (Phần 1) | `/company/jobs/create` | Tiêu đề tuyển dụng, Ngành nghề, Hình thức làm việc, Địa điểm, Mức trợ cấp (min-max), Kỹ năng yêu cầu |

---

## 4. Các luồng nghiệp vụ chính (User Flows)

### 4.1. Luồng Sinh viên
1. Vào trang chủ -> Xem danh sách việc làm, tìm kiếm / lọc việc làm.
2. Đăng ký tài khoản (chọn vai trò Sinh viên) -> Đăng nhập.
3. Hoàn thiện Hồ sơ cá nhân & CV (`/student/profile`).
4. Dashboard (`/student/dashboard`):
   - Xem các công việc được Matching tự động dựa trên Kỹ năng.
   - Nộp đơn vào các vị trí thực tập mong muốn.
   - Theo dõi trạng thái đơn ứng tuyển (Chờ duyệt, Đã duyệt, Từ chối).

### 4.2. Luồng Doanh nghiệp
1. Đăng ký tài khoản (chọn vai trò Doanh nghiệp) -> Đăng nhập.
2. Hoàn thiện Hồ sơ công ty (`/company/profile`): tên công ty, mã số thuế, quy mô, logo, liên hệ.
3. Đăng tin tuyển dụng mới (`/company/jobs/create`): nhập đầy đủ thông tin lương/trợ cấp, yêu cầu, kỹ năng, quyền lợi.
4. Dashboard (`/company/dashboard`):
   - Theo dõi số lượng tin đăng, hồ sơ nhận được.
   - Quản lý tin tuyển dụng (sửa, xóa, đóng tin).
   - Xem hồ sơ ứng viên nộp CV và xét duyệt ứng viên.
