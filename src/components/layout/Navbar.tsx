'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, Home, Search, PlusCircle, User as UserIcon, ChevronDown, LogOut, LayoutDashboard, UserCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, login } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold text-blue-900 tracking-tight">
              InternMatch<span className="text-amber-500">.</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === '/' ? 'text-blue-600 bg-blue-50/70' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>

            <Link
              href="/jobs"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname.startsWith('/jobs') ? 'text-blue-600 bg-blue-50/70' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Cơ hội thực tập</span>
            </Link>

            {currentUser?.role === 'COMPANY' && (
              <Link
                href="/company/jobs/create"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition border border-emerald-200"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>Đăng tin tuyển</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right Auth / Profile section */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 bg-white transition text-sm font-medium text-gray-800 shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span>{currentUser.username}</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    currentUser.role === 'STUDENT'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {currentUser.role === 'STUDENT' ? 'Sinh viên' : 'Doanh nghiệp'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-sm animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>

                  <Link
                    href={currentUser.role === 'STUDENT' ? '/student/dashboard' : '/company/dashboard'}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4 text-gray-400" />
                    Dashboard
                  </Link>

                  <Link
                    href={currentUser.role === 'STUDENT' ? '/student/profile' : '/company/profile'}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <UserCheck className="w-4 h-4 text-gray-400" />
                    Hồ sơ {currentUser.role === 'STUDENT' ? 'cá nhân' : 'doanh nghiệp'}
                  </Link>

                  <div className="border-t border-gray-100 my-1" />

                  {/* Switch demo account helper */}
                  <button
                    onClick={() => {
                      if (currentUser.role === 'STUDENT') {
                        login('inuff', 'COMPANY');
                        router.push('/company/dashboard');
                      } else {
                        login('nhitran', 'STUDENT');
                        router.push('/student/dashboard');
                      }
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-blue-600 hover:bg-blue-50 font-medium"
                  >
                    Chuyển sang tài khoản {currentUser.role === 'STUDENT' ? 'Doanh nghiệp (inuff)' : 'Sinh viên (nhitran)'}
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                      router.push('/login');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-600 transition"
              >
                Đăng nhập
              </Link>

              <div className="relative">
                <button
                  onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
                >
                  <span>Đăng ký</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {registerDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-sm"
                    onMouseLeave={() => setRegisterDropdownOpen(false)}
                  >
                    <Link
                      href="/register?role=STUDENT"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => setRegisterDropdownOpen(false)}
                    >
                      Dành cho Sinh viên
                    </Link>
                    <Link
                      href="/register?role=COMPANY"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => setRegisterDropdownOpen(false)}
                    >
                      Dành cho Doanh nghiệp
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
