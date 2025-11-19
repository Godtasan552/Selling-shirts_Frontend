"use client";

import { useState } from "react";
import { phoneRegex } from "@/utils/phoneregex";
import Input from "@/components/auth_user/Input";
import Button from "@/components/auth_user/Button";
import ErrorText from "@/components/auth_user/ErrorText";
import { post } from "@/lib/authApi";
import { LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface LoginResponse {
  message?: string;
  token?: string;
  [key: string]: unknown;
}

export default function LoginPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const GOOGLE_URL = `${API_URL}/auth/google/redirect`;

  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const router = useRouter();

  // Login ด้วยเบอร์โทร
  const handleLogin = async () => {
    if (!phoneRegex.test(phone)) {
      setError("เบอร์โทรไม่ถูกต้อง");
      return;
    }

    const res = await post<LoginResponse>(`${API_URL}/auth/login`, { phone, password });

    if (res.status === 200) {
      if (res.data?.token) {
        localStorage.setItem("auth_token", res.data.token); // สำหรับ login แบบเบอร์โทร
      }
      router.push("/history");
    } else {
      setError(String(res.data?.message) || "เบอร์หรือรหัสผ่านผิด");
    }
  };

  // Login ด้วย Google
  const handleGoogleLogin = () => {
    // redirect ไป backend เพื่อเริ่ม OAuth
    window.location.href = GOOGLE_URL;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        <LogIn /> Login
      </h1>

      {/* Login ด้วยเบอร์ */}
      <Input
        label="Phone Number"
        type="text"
        value={phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
      />

      {error && <ErrorText message={error} />}

      <Button onClick={handleLogin}>Login</Button>

      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-1 h-[1px] bg-gray-300"></div>
        <span className="px-2 text-gray-500 text-sm">หรือ</span>
        <div className="flex-1 h-[1px] bg-gray-300"></div>
      </div>

      {/* Login ด้วย Google */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 border p-2 rounded-md hover:bg-gray-100 transition"
      >
        <Image
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="google"
          width={20}
          height={20}
        />
        <span className="text-gray-700 font-medium">Login with Google</span>
      </button>
    </div>
  );
}
