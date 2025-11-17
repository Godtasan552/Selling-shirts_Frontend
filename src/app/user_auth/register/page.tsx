"use client";

import { useState } from "react";
import { phoneRegex } from "@/utils/phoneregex";
import Input from "@/components/auth_user/Input";
import Button from "@/components/auth_user/Button";
import ErrorText from "@/components/auth_user/ErrorText";
import { post } from "@/lib/authApi";
import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    // validate phone
    if (!phoneRegex.test(phone)) {
      setError("เบอร์โทรไม่ถูกต้อง (ต้องมี 10 หลัก และขึ้นต้นด้วย 0)");
      return;
    }

    const res = await post(`${API_URL}/auth/register`, {
      phone,
      password,
    });

    if (res.success) {
      router.push(`/auth/verify?phone=${phone}`);
    } else {
      setError(res.message || "เกิดข้อผิดพลาด");
    }
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
        onChange={(e: any) => setPhone(e.target.value)}
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e: any) => setPassword(e.target.value)}
      />

      {error && <ErrorText message={error} />}

      <Button onClick={handleRegister}>Register</Button>
    </div>
  );
}
