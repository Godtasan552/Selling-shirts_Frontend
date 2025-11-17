"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Input from "@/components/auth_user/Input";
import Button from "@/components/auth_user/Button";
import ErrorText from "@/components/auth_user/ErrorText";
import { post } from "@/lib/authApi";

export default function VerifyOTPPage() {
    const params = useSearchParams();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const searchParams = useSearchParams();
    const phone = searchParams.get("phone") || "";
    const otpFromRegister = params.get("otp") || "";

    const [otp, setOtp] = useState(otpFromRegister);
    const [error, setError] = useState("");
    const [resendMsg, setResendMsg] = useState("");
    const [timer, setTimer] = useState(60);
    useEffect(() => {
        if (timer <= 0) return;
        const timeout = setTimeout(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [timer]);
    const handleVerify = async () => {
        const res = await post(`${API_URL}/auth/verify-otp`, {
            phone,
            otp,
        });
        if (res.status == 200) {
            window.location.href = "/user_auth/login";
        } else {
            setError(res.message || "OTP ไม่ถูกต้อง");
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        const res = await post(`${API_URL}/auth/resend-otp`, { phone });

        if (res.status === 200) {
            setOtp(res.otp);
            setResendMsg("ส่ง OTP ใหม่แล้ว");
            setTimer(60);
        } else {
            setError("ส่ง OTP ไม่สำเร็จ");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow">
            <h1 className="text-xl font-bold mb-3">Verify OTP</h1>
            <p className="text-gray-500 mb-3">OTP sent to: {phone}</p>
            <p className="text-gray-500 mb-3">ไม่มีระบบส่ง otp ผ่าน sms ครับ</p>
            <p className="text-gray-500 mb-3">OTP: {otp}</p>
            <p className="text-gray-500 mb-3">
                {timer > 0 ? (
                    <>ขอ OTP ใหม่ได้ใน <span className="font-semibold">{timer}</span> วินาที</>
                ) : (
                    <span className="text-green-600">สามารถขอ OTP ใหม่ได้แล้ว</span>
                )}
            </p>

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
