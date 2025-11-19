"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    async function checkLogin() {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include"
      });
      const data = await res.json();

      if (data.authenticated) router.push("/history");
      else router.push("/user_auth/login");
    }

    checkLogin();
  }, []);

  return <p>กำลังเข้าสู่ระบบด้วย Google...</p>;
}
