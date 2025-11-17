'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const userIsLoggedIn = localStorage.getItem('loggedIn') === 'true';
    if (userIsLoggedIn) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    setLoggedIn(false);
  };

  const handleLogin = () => {
    // ในหน้า Login จริงๆ หลังจาก Login สำเร็จให้ใช้ localStorage.setItem('loggedIn', 'true');
    // นี่เป็นแค่การจำลอง
    localStorage.setItem('loggedIn', 'true');
    setLoggedIn(true);
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
            <Link href="/order-history" className="text-gray-800 mr-4">
              ประวัติการสั่งซื้อ
            </Link>
          </div>
          {loggedIn ? (
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          ) : (
            //  ลิงค์หน้า login ตรงนี้
            <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
