"use client";

import { useEffect, useState } from "react";
import OrderProductCard from "@/components/user/productCard";
import { post } from "@/lib/authApi";
import { Receipt, Send } from "lucide-react";

export default function OrderPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState<any[]>([]);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    note: "",
  });

  // โหลดสินค้า
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_URL}/api/public/home-stats`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.stats.products);
      }
    };

    load();
  }, []);

  const addToCart = (item: any) => {
    setCart((p) => [...p, item]);
  };

  const onSubmit = async () => {
    if (cart.length === 0) return alert("กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้น");

    const res = await post(`${API_URL}/orders/create`, {
      ...form,
      items: cart,
    });
    console.log("RESPONSE CREATE ORDER =>", res);

    if (res.status === 201 || res.status === 200) {
        const orderId = (res as any).order?._id;

  if (!orderId) {
    alert("ไม่พบ Order ID จาก API");
    return;
  }

  window.location.href = `/order/upload-slip?id=${orderId}`;
} else {
  alert("เกิดข้อผิดพลาดในการสร้าง Order");
}


  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Receipt /> สั่งซื้อสินค้า
      </h1>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p: any) => (
          <OrderProductCard key={p.productId} product={p} onAdd={addToCart} />
        ))}
      </div>

      {/* Cart Summary */}
      <div className="p-4 border rounded-xl bg-white shadow-md animate__animated animate__fadeInUp">
        <h2 className="font-bold text-xl mb-3">ตะกร้าสินค้า</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีสินค้าในตะกร้า</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {cart.map((c, i) => (
              <li key={i}>
                - {c.sku} จำนวน {c.quantity}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Form */}
      <div className="p-4 border rounded-xl bg-white shadow-md animate__animated animate__fadeInUp">
        <h2 className="font-bold text-xl mb-3">ข้อมูลผู้สั่งซื้อ</h2>

        {[
          { key: "customerName", label: "ชื่อ-นามสกุล" },
          { key: "customerPhone", label: "เบอร์โทร" },
          { key: "customerEmail", label: "อีเมล" },
          { key: "customerAddress", label: "ที่อยู่จัดส่ง" },
          { key: "note", label: "หมายเหตุ" },
        ].map((f) => (
          <input
            key={f.key}
            placeholder={f.label}
            className="border p-2 w-full rounded mb-2"
            value={(form as any)[f.key]}
            onChange={(e) =>
              setForm({ ...form, [f.key]: e.target.value })
            }
          />
        ))}

        <button
          onClick={onSubmit}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-900"
        >
          <Send size={18} />
          สร้างคำสั่งซื้อ
        </button>
      </div>
    </div>
  );
}
