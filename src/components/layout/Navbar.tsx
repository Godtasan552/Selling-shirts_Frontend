'use client';
import React, { useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, clearAuth } from '../../lib/authUtils';

// ฟังก์ชันเช็ค cookie auth_token
function hasAuthTokenCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c: string) => c.startsWith("auth_token="));
}

// ฟังก์ชันเช็ค login status
function checkLoginStatus(): boolean {
  return hasAuthTokenCookie() || isAuthenticated();
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  // State สำหรับ hydration-safe rendering
  const [mounted, setMounted] = useState(false);
  const [loggedInStatus, setLoggedInStatus] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return checkLoginStatus();
  });

  // ทำให้ component รู้ว่า client render แล้ว
  useEffect(() => {
    // delay setState หลัง render
    const id = requestAnimationFrame(() => {
      setMounted(true);
      setLoggedInStatus(checkLoginStatus());
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Update login status เมื่อ pathname เปลี่ยน
  useEffect(() => {
    if (!mounted) return;
    const id = requestAnimationFrame(() => setLoggedInStatus(checkLoginStatus()));
    return () => cancelAnimationFrame(id);
  }, [pathname, mounted]);

  // Listen to storage changes (multi-tab sync)
  useEffect(() => {
    if (!mounted) return;

    const handleStorageChange = (): void => {
      setLoggedInStatus(checkLoginStatus());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [mounted]);

  // Handle logout
  const handleLogout = useCallback((): void => {
    clearAuth(); // ลบ localStorage
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // ลบ cookie
    setLoggedInStatus(false);
    router.push('/user_auth/login');
  }, [router]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-gray-800 text-lg font-black hover:text-primary transition-colors">
          Selling Shirts
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/history" className="text-gray-700 hover:text-primary font-medium transition-colors text-sm sm:text-base">
            📋 ประวัติการสั่งซื้อ
          </Link>

          {/* Conditional render login/logout button แบบ hydration-safe */}
          {mounted && (
            loggedInStatus ? (
              <button
                onClick={handleLogout}
                className="btn btn-error btn-sm sm:btn-md font-bold transition-all hover:scale-105 shadow-md"
              >
                🚪 Logout
              </button>
            ) : (
              <Link
                href="/user_auth/login"
                className="btn btn-primary btn-sm sm:btn-md font-bold transition-all hover:scale-105 shadow-md"
              >
                🔐 Login
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
