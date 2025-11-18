"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Upload, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function UploadSlipPage() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");

  const total = Number(params.get("total")) || 0;
  const shipping = Number(params.get("shipping")) || 0;
  const subtotal = Number(params.get("subtotal")) || 0;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("ขนาดไฟล์ต้องน้อยกว่า 5MB");
        return;
      }
      if (!selectedFile.type.startsWith("image/")) {
        setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const upload = async () => {
    if (!file) {
      setError("กรุณาเลือกไฟล์ก่อน");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("slip", file);

      const res = await fetch(`${API_URL}/orders/${id}/upload-slip`, {
        method: "POST",
        body: form,
      });

      if (res.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/history");
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || "อัปโหลดไม่สำเร็จ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="กลับไป"
          >
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">ยืนยันการชำระเงิน</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">อัปโหลดสำเร็จ!</p>
              <p className="text-sm text-green-700">กำลังนำเสนอคำสั่งซื้อของคุณ...</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: QR Code */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4 text-center">สแกน QR Code</h2>
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src="/images/QR_code.png"
                  alt="QR Code"
                  className="w-full aspect-square object-cover"
                />
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                สแกน QR Code เพื่อเปิดแอปธนาคาร
              </p>
            </div>
          </div>

          {/* Right: Upload & Summary */}
          <div className="md:col-span-2 space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-semibold text-gray-900 mb-4">สรุปค่าใช้บริการ</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ค่าสินค้า</span>
                  <span className="font-medium text-gray-900">
                    ฿{subtotal.toLocaleString("th-TH")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ค่าจัดส่ง</span>
                  <span className="font-medium text-gray-900">
                    ฿{shipping.toLocaleString("th-TH")}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">ยอดชำระทั้งหมด</span>
                  <span className="text-lg font-bold text-green-600">
                    ฿{total.toLocaleString("th-TH")}
                  </span>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-semibold text-gray-900 mb-4">อัปโหลดสลิปการชำระเงิน</h2>

              <div className="space-y-4">
                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เลือกไฟล์รูปภาพ
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={loading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition bg-gray-50 hover:bg-gray-100">
                      <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700">
                        {file ? file.name : "คลิกเพื่อเลือกไฟล์"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        รองรับ JPG, PNG (สูงสุด 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {file && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">ตัวอย่างรูปภาพ</p>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-2">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-48 object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={upload}
                  disabled={loading || !file || success}
                  className="w-full py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      กำลังอัปโหลด...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle size={20} />
                      อัปโหลดสำเร็จ
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      อัปโหลดสลิป
                    </>
                  )}
                </button>

                {/* Back Button */}
                <Link
                  href="/order"
                  className="w-full py-3 border border-gray-300 text-gray-900 font-semibold rounded-lg text-center hover:bg-gray-50 transition"
                >
                  ← กลับไปหน้าแรก
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}