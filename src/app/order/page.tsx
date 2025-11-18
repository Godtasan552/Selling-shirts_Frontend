"use client";

import { useEffect, useState } from "react";
import OrderProductCard from "@/components/user/productCard";
import { post } from "@/lib/authApi";
import { Receipt, Send, Trash2 } from "lucide-react"; // 1. เพิ่ม Trash2

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
      try {
        const res = await fetch(`${API_URL}/api/public/home-stats`);
        const data = await res.json();

        if (data.success) {
          setProducts(data.stats.products);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };

    load();
  }, []);

  const addToCart = (item: any) => {
    const coerced = {
      ...item,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    };
    setCart((p) => [...p, coerced]);
  };

  // 2. เพิ่มฟังก์ชันลบสินค้าออกจากตะกร้า
  const removeFromCart = (indexToRemove: number) => {
    setCart((prevCart) => prevCart.filter((_, index) => index !== indexToRemove));
  };
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;       // แปลงเป็นตัวเลข ถ้าไม่มีให้เป็น 0
    const qty = Number(item.quantity) || 1;      // แปลงเป็นตัวเลข ถ้าไม่มีให้เป็น 1
    return sum + (price * qty);
  }, 0);
  const shippingCost = totalQuantity > 0
    ? 50 + ((totalQuantity - 1) * 10)
    : 0;
  const grandTotal = subtotal + shippingCost;

  const onSubmit = async () => {
    if (cart.length === 0) return alert("กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้น");

    const res = await post(`${API_URL}/orders/create`, {
      ...form,
      items: cart,
      totalPrice: grandTotal,
      shippingCost: shippingCost
    });

    if (res.status === 201 || res.status === 200) {
      const orderId = res.data?.order?._id;

      if (!orderId) {
        alert("ไม่พบ Order ID จาก API");
        return;
      }

      window.location.href = `/order/uploadslip?id=${orderId}&total=${grandTotal}&shipping=${shippingCost}&subtotal=${subtotal}`;

    } else {
      alert("เกิดข้อผิดพลาดในการสร้าง Order");
    }
  };

return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Receipt /> สั่งซื้อสินค้า
      </h1>

      {/* รายการสินค้า */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p: any) => (
          // OrderProductCard ต้องเลือก Variant และส่ง item ที่มี .price กลับมาใน onAdd
          <OrderProductCard key={p.productId} product={p} onAdd={addToCart} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ตะกร้าสินค้า & สรุปยอดเงิน */}
        <div className="p-4 border rounded-xl bg-white shadow-md h-fit">
          <h2 className="font-bold text-xl mb-3 flex items-center gap-2">
             ตะกร้าสินค้า <span className="text-sm font-normal text-gray-500">({totalQuantity} ชิ้น)</span>
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-4">ยังไม่มีสินค้าในตะกร้า</p>
          ) : (
            <>
              <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2 mb-4">
                {cart.map((c, i) => (
                  <li key={i} className="flex justify-between items-start border-b pb-2 last:border-0">
                    <div>
                      <div className="font-medium text-sm">{c.sku}</div>
                      <div className="text-xs text-gray-500">
                         {c.size} | ราคา {c.price?.toLocaleString()} บ.
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">
                          {Number((c.price || 0) * (c.quantiy || 1)).toLocaleString()} บ.
                      </span>
                      <button 
                        onClick={() => removeFromCart(i)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* ส่วนสรุปยอดเงิน (Highlight) */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm border border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>รวมค่าสินค้า</span>
                  <span>{subtotal.toLocaleString()} บาท</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ค่าจัดส่ง <span className="text-xs">(ชิ้นแรก 50, ต่อไป +10)</span></span>
                  <span>{shippingCost.toLocaleString()} บาท</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold text-lg text-black">
                  <span>ยอดชำระรวม</span>
                  <span className="text-blue-600">{grandTotal.toLocaleString()} บาท</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ฟอร์มข้อมูลลูกค้า */}
        <div className="p-4 border rounded-xl bg-white shadow-md h-fit">
          <h2 className="font-bold text-xl mb-3">ข้อมูลจัดส่ง</h2>

          {[
            { key: "customerName", label: "ชื่อ-นามสกุล" },
            { key: "customerPhone", label: "เบอร์โทร" },
            { key: "customerEmail", label: "อีเมล" },
            { key: "customerAddress", label: "ที่อยู่จัดส่ง" },
            { key: "note", label: "หมายเหตุ (ถ้ามี)" },
          ].map((f) => (
            <div key={f.key} className="mb-3">
                <label className="text-xs font-medium text-gray-700 mb-1 block">{f.label}</label>
                <input
                    placeholder={f.label}
                    className="border p-2 w-full rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
            </div>
          ))}

          <button
            onClick={onSubmit}
            disabled={cart.length === 0}
            className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-lg transition font-medium text-sm
                ${cart.length === 0 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-black text-white hover:bg-gray-900 shadow-lg"
                }`}
          >
            <Send size={16} />
            ยืนยันคำสั่งซื้อ ({grandTotal.toLocaleString()} บ.)
          </button>
        </div>

      </div>
    </div>
  );
}