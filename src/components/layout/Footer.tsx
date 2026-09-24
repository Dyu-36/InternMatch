import React from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, Mail, Phone, Facebook, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                InternMatch<span className="text-amber-400">.</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Cầu nối tin cậy giữa các bạn sinh viên tài năng và hàng ngàn doanh nghiệp hàng đầu tại Việt Nam. Bắt đầu sự nghiệp vững chắc ngay từ hôm nay.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-700 transition">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Dành cho sinh viên */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base">Dành cho Sinh viên</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-white transition">Tìm kiếm thực tập</Link>
              </li>
              <li>
                <Link href="/register?role=STUDENT" className="hover:text-white transition">Đăng ký tài khoản</Link>
              </li>
              <li>
                <Link href="/student/profile" className="hover:text-white transition">Tạo CV chuyên nghiệp</Link>
              </li>
              <li>
                <Link href="/student/dashboard" className="hover:text-white transition">Khuyến nghị việc làm AI</Link>
              </li>
            </ul>
          </div>

          {/* Dành cho Doanh nghiệp */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base">Dành cho Doanh nghiệp</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/company/jobs/create" className="hover:text-white transition">Đăng tin thực tập</Link>
              </li>
              <li>
                <Link href="/register?role=COMPANY" className="hover:text-white transition">Đăng ký đối tác</Link>
              </li>
              <li>
                <Link href="/company/dashboard" className="hover:text-white transition">Quản lý hồ sơ ứng viên</Link>
              </li>
              <li>
                <Link href="/company/dashboard" className="hover:text-white transition">Cổng quản trị hệ thống</Link>
              </li>
            </ul>
          </div>

          {/* Liên hệ hỗ trợ */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base">Liên hệ hỗ trợ</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Hà Nội &amp; TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>support@internmatch.vn</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>+84 (0) 987 654 321</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 pt-1">
              Hỗ trợ 24/7 cho sinh viên và nhà tuyển dụng.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 InternMatch Inc. Bản quyền thuộc về nền tảng kết nối thực tập sinh Việt Nam.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-400 transition">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-gray-400 transition">Chính sách bảo mật</a>
            <a href="#" className="hover:text-gray-400 transition">Quy chế hoạt động</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
