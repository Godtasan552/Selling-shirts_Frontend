"use client";

import { useState } from "react";
import { phoneRegex } from "@/utils/phoneregex";
import Input from "@/components/auth_user/Input";
import Button from "@/components/auth_user/Button";
import ErrorText from "@/components/auth_user/ErrorText";
import { post } from "@/lib/authApi";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!phoneRegex.test(phone)) {
      setError("เบอร์โทรไม่ถูกต้อง");
      return;
    }

    const res = await post(`${API_URL}/auth/login`, {
      phone,
      password,
    });

    if (res.success) {
      window.location.href = "/";
    } else {
      setError(res.message || "เบอร์หรือรหัสผ่านผิด");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        <LogIn /> Login
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

      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
}
