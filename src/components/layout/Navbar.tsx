'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, clearAuth } from '../../lib/authUtils';

// ฟังก์ชันเช็ค cookie auth_token
function hasAuthTokenCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c.startsWith("auth_token="));
}

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [loggedInStatus, setLoggedInStatus] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // เช็คทั้ง cookie และ localStorage (isAuthenticated)
    const loggedIn =
      hasAuthTokenCookie() ||    // login ผ่าน Google (cookie)
      isAuthenticated();         // login ปกติ (localStorage)

    setLoggedInStatus(loggedIn);
  }, [pathname]);

  // sync login status ในหลาย tab
  useEffect(() => {
    const handleStorageChange = () => {
      const loggedIn =
        hasAuthTokenCookie() ||
        isAuthenticated();
      setLoggedInStatus(loggedIn);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    clearAuth(); // ลบ localStorage
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // ลบ cookie

    setLoggedInStatus(false);
    router.push('/user_auth/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="flex justify-between items-center px-4 py-4">
        <Link href="/" className="text-gray-800 text-lg font-bold">
          Selling Shirts
        </Link>

        <div className="flex items-center">
          <Link href="/history" className="text-gray-800 mr-4">
            ประวัติการสั่งซื้อ
          </Link>

          {isClient && loggedInStatus ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/user_auth/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
