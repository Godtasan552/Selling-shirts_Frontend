"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    // Cookie ถูก backend set แล้ว → user login แล้ว
    router.push("/"); // หรือหน้าอื่น
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>กำลังเข้าสู่ระบบด้วย Google...</p>
    </div>
  );
}
