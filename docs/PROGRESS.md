# InternMatch — Theo dõi tiến độ

## Trạng thái ngày 2026-09-24

Repository: `Dyu-36/InternMatch`. Nhánh chính: `main`.

- [x] Giai đoạn 1: chốt phạm vi theo Contract và 12 mockup.
- [x] Giai đoạn 2: UI foundation.
- [x] Giai đoạn 3: public UI và tìm kiếm/lọc.
- [x] Giai đoạn 4: authentication UI.
- [x] Giai đoạn 5: student UI.
- [x] Giai đoạn 6: company UI.
- [x] Giai đoạn 7: lint/build, route smoke, kiểm tra ảnh desktop/tablet/mobile.
- [x] Giai đoạn 8: backend Supabase và kiểm thử từng luồng.

## Backend

- [x] Dùng project Supabase InternMatch tại Singapore.
- [x] Apply PostgreSQL schema và migration bảo mật.
- [x] Supabase Auth bằng username/mật khẩu, tạo profile nguyên tử bằng trigger.
- [x] Cookie session, refresh token, route guard và Server Actions.
- [x] RLS theo vai trò/chủ sở hữu; không cho đổi vai trò hay giả mạo chủ tin.
- [x] Storage cho avatar/logo và CV riêng tư; kiểm tra loại/dung lượng file.
- [x] Dữ liệu thật cho khách, sinh viên và doanh nghiệp; không fallback mock.
- [x] CRUD tin tuyển dụng, ứng tuyển duy nhất, kiểm tra hạn nhận hồ sơ.
- [x] Doanh nghiệp xem CV và cập nhật trạng thái; sinh viên xem kết quả.
- [x] Matching bằng so khớp kỹ năng chính xác sau khi chuẩn hóa.
- [x] Giao diện Tiếng Việt/English; giữ nguyên public routes.
- [x] 11 nhóm kiểm thử backend, bao gồm kiểm tra truy cập trái quyền.
- [x] Luồng Chromium với hai tài khoản, upload thật và kiểm tra persistence.

Chi tiết sử dụng và vận hành: [HANDOVER.md](./HANDOVER.md). Kết quả giao diện: [PHASE-7-VISUAL-QA.md](./PHASE-7-VISUAL-QA.md).

## Thay đổi sau PR #6

Sửa cách xử lý signup; thay client REST/localStorage bằng Supabase SDK và Server Actions; bổ sung session refresh, nút ứng tuyển, menu tài khoản, CV có URL tạm thời, kiểm tra dữ liệu phía server và phân quyền database. Bổ sung đa ngôn ngữ trong Contract, xóa số liệu mẫu trên trang chủ, sửa tương phản CTA và nối footer tới các chức năng thật.
