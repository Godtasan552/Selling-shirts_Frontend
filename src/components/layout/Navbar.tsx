'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname
import { isAuthenticated, clearAuth } from '../../lib/authUtils';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname
  const [isClient, setIsClient] = useState(false);
  const [loggedInStatus, setLoggedInStatus] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Update loggedInStatus when component mounts or pathname changes
    setLoggedInStatus(isAuthenticated());
  }, [pathname]); // Add pathname as a dependency

  // Listen for storage changes to update login status across tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      setLoggedInStatus(isAuthenticated());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const handleLogout = () => {
    clearAuth();
    setLoggedInStatus(false); // Update state immediately
    router.push('/user_auth/login'); // Redirect to login page after logout
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="flex justify-between items-center px-4 py-4">
        <div className="text-gray-800 text-lg font-bold">
          <Link href="/" className="text-gray-800 text-lg font-bold">
            Selling Shirts
          </Link>
        </div>
        
        <div className="flex items-center">
          <div className="relative">
            {/* เชื่อม หน้าประวัติการสั่งซื้อ ตรงนี้ */}
            <Link href="/history" className="text-gray-800 mr-4">
              ประวัติการสั่งซื้อ
            </Link>
          </div>
          {isClient && loggedInStatus ? (
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          ) : (
            //  ลิงค์หน้า login ตรงนี้
            <Link href="/user_auth/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
