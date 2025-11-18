"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Upload } from "lucide-react";

export default function UploadSlipPage() {
  const params = useSearchParams();
  const id = params.get("id");

  // รับข้อมูลยอดเงินจาก query
  const total = Number(params.get("total")) || 0;
  const shipping = Number(params.get("shipping")) || 0;
  const subtotal = Number(params.get("subtotal")) || 0;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [file, setFile] = useState<any>(null);

  const upload = async () => {
    const form = new FormData();
    form.append("slip", file);

    const res = await fetch(`${API_URL}/orders/${id}/upload-slip`, {
      method: "POST",
      body: form,
    });

    if (res.status === 200) {
      alert("อัปโหลดสลิปสำเร็จ!");
      window.location.href = "/history";
    } else {
      alert("อัปโหลดไม่สำเร็จ");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">อัปโหลดสลิปการชำระเงิน</h1>

      {/* QR Code (เก็บใน public/images/) */}
      <img 
        src="/images/QR_code.png" 
        className="w-full rounded-lg shadow"
      />

      {/* แสดงยอดเงินที่ต้องชำระ */}
      <div className="mt-4 text-left space-y-1 text-sm">
        <div className="flex justify-between">
          <span>ค่าสินค้า</span>
          <span>{subtotal.toLocaleString()} บาท</span>
        </div>

        <div className="flex justify-between">
          <span>ค่าจัดส่ง</span>
          <span>{shipping.toLocaleString()} บาท</span>
        </div>

        <div className="border-t pt-2 flex justify-between font-bold text-lg">
          <span>ยอดชำระทั้งหมด</span>
          <span className="text-green-600">
            {total.toLocaleString()} บาท
          </span>
        </div>
      </div>

      {/* Upload Area */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 w-full rounded mb-3"
      />

      <button
        onClick={upload}
        className="w-full bg-black text-white flex items-center justify-center gap-2 py-2 rounded"
      >
        <Upload size={20} />
        อัปโหลดสลิป
      </button>
    </div>
  );
}
