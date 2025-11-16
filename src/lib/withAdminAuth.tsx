// lib/withAdminAuth.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ← สำหรับ App Router

// ดึง token จาก localStorage
const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
};

export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = getAccessToken();

      if (!token) {
        router.push("/admin/login");
      } else {
        setLoading(false);
      }
    }, [router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
