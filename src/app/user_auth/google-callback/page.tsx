
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch(`${API_URL}/auth/google/token`, {
          method: "GET",
          credentials: "include",
        });
        
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("auth_token", data.token);
          router.push("/history");
        } else {
          router.push("/user_auth/login");
        }
      } catch (error) {
        router.push("/user_auth/login");
      }
    }

    fetchToken();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>กำลังเข้าสู่ระบบด้วย Google...</p>
    </div>
  );
}
