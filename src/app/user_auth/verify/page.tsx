"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Input from "@/components/auth_user/Input";
import Button from "@/components/auth_user/Button";
import ErrorText from "@/components/auth_user/ErrorText";
import { post } from "@/lib/authApi";

export default function VerifyOTPPage() {

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendMsg, setResendMsg] = useState("");

  const handleVerify = async () => {
    const res = await post(`${API_URL}/auth/verify-otp`, {
      phone,
      otp,
    });

    if (res.success) {
      window.location.href = "/auth/login";
    } else {
      setError(res.message || "OTP ไม่ถูกต้อง");
    }
  };

  const handleResend = async () => {
    const res = await post(`${API_URL}/auth/resend-otp`, { phone });

    if (res.success) {
      setResendMsg("ส่ง OTP ใหม่แล้ว");
    } else {
      setError("ส่ง OTP ไม่สำเร็จ");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow">
      <h1 className="text-xl font-bold mb-3">Verify OTP</h1>
      <p className="text-gray-500 mb-3">OTP sent to: {phone}</p>

      <Input
        label="OTP"
        type="text"
        value={otp}
        onChange={(e: any) => setOtp(e.target.value)}
      />

      {error && <ErrorText message={error} />}
      {resendMsg && <p className="text-green-500">{resendMsg}</p>}

      <Button className="w-full mt-3" onClick={handleVerify}>
        Verify
      </Button>

      <button
        className="mt-3 text-blue-600 underline"
        onClick={handleResend}
      >
        Resend OTP
      </button>
    </div>
  );
}
