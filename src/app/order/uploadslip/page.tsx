"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Upload } from "lucide-react";

export default function UploadSlipPage() {
  const params = useSearchParams();
  const id = params.get("id");
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
      window.location.href = "/user/orders";
    } else {
      alert("อัปโหลดไม่สำเร็จ");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">อัปโหลดสลิปการชำระเงิน</h1>

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
