"use client";

import { useState } from "react";
import { phoneRegex, passwordRegex } from "@/utils/phoneregex";
import Input from "@/components/auth_user/Input";
import Button from "@/components/auth_user/Button";
import ErrorText from "@/components/auth_user/ErrorText";
import { post } from "@/lib/authApi";
import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const GOOGLE_URL = `${API_URL}/auth/google/redirect`;

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    // validate phone
    if (!phoneRegex.test(phone)) {
      setError("เบอร์โทรไม่ถูกต้อง (ต้องมี 10 หลัก และขึ้นต้นด้วย 0)");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("รหัสผ่านต้องมีอย่างน้อย 7 ตัว และมีตัวใหญ่ ตัวเล็ก และอักขระพิเศษ");
      return;
    }

    const res = await post(`${API_URL}/auth/register`, {
      phone,
      password,
    });

    if (res.status === 200 || res.status === 201) {
      router.push(
        `/user_auth/verify?phone=${res.data.phone}&otp=${res.data.otp}`
      );
    } else {
      setError(res.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = GOOGLE_URL;
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Phone size={20} /> Register with Phone
      </h1>

      <Input
        label="Phone Number"
        type="text"
        value={phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPhone(e.target.value)
        }
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      />

      {error && <ErrorText message={error} />}

      <Button onClick={handleRegister}>Register</Button>

      {/* divider */}
      <div className="flex items-center my-4">
        <div className="flex-1 h-[1px] bg-gray-300"></div>
        <span className="px-2 text-gray-500 text-sm">หรือ</span>
        <div className="flex-1 h-[1px] bg-gray-300"></div>
      </div>

      {/* ⭐ Signup via Gmail */}
      <button
        onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center gap-2 border p-2 rounded-md hover:bg-gray-100 transition"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="google"
          className="w-5 h-5"
        />
        <span className="text-gray-700 font-medium">Sign up with Google</span>
      </button>
    </div>
  );
}
