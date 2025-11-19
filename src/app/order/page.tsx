"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // <-- เพิ่มตรงนี้
import OrderProductCard from "@/components/user/productCard";
import { post } from "@/lib/authApi";
import { Receipt, Send, Trash2 } from "lucide-react";

// ✅ Updated Product interface to match API data
interface ProductVariant {
  sku: string;
  size: string;
  stock: number;
  price: number | string;
}

interface Product {
  productId: string;
  name: string;
  imageUrl?: string;
  totalSold: number;
  variants: ProductVariant[];
}

interface CartItem {
  productId: string;
  sku: string;
  size: string;
  price: number;
  quantity: number;
  name: string;
}

interface FormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  note: string;
}

interface FormField {
  key: keyof FormData;
  label: string;
  required: boolean;
}

interface ApiResponse {
  status: number;
  data?: {
    order?: {
      _id: string;
    };
  };
}

// ✅ Move API_URL outside component
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Page() {
  const router = useRouter(); // <-- เพิ่มตรงนี้

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    note: "",
  });

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

  const addToCart = (item: CartItem) => {
    setCart((p) => [...p, item]);
  };

  const removeFromCart = (indexToRemove: number) => {
    setCart((prevCart) => prevCart.filter((_, index) => index !== indexToRemove));
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = totalQuantity > 0 ? 50 + (totalQuantity - 1) * 10 : 0;
  const grandTotal = subtotal + shippingCost;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.customerName.trim()) {
      newErrors.customerName = "กรุณากรอกชื่อ-นามสกุล";
    }

    if (!form.customerPhone.trim()) {
      newErrors.customerPhone = "กรุณากรอกเบอร์โทร";
    } else if (!/^[0-9]{10}$/.test(form.customerPhone.replace(/\D/g, ""))) {
      newErrors.customerPhone = "เบอร์โทรต้องเป็นตัวเลข 10 หลัก";
    }

    if (!form.customerEmail.trim()) {
      newErrors.customerEmail = "กรุณากรอกอีเมล";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
      newErrors.customerEmail = "กรุณากรอกอีเมลให้ถูกต้อง";
    }

    if (!form.customerAddress.trim()) {
      newErrors.customerAddress = "กรุณากรอกที่อยู่จัดส่ง";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (cart.length === 0) return alert("กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้น");

    if (!validateForm()) return;

    const res = (await post(`${API_URL}/orders/create`, {
      ...form,
      items: cart,
      totalPrice: grandTotal,
      shippingCost: shippingCost,
    })) as ApiResponse;

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

  const formFields: FormField[] = [
    { key: "customerName", label: "ชื่อ-นามสกุล", required: true },
    { key: "customerPhone", label: "เบอร์โทร", required: true },
    { key: "customerEmail", label: "อีเมล", required: true },
    { key: "customerAddress", label: "ที่อยู่จัดส่ง", required: true },
    { key: "note", label: "หมายเหตุ (ถ้ามี)", required: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-200 to-rose-200">
            <Receipt size={24} className="text-pink-600" />
          </div>
          <h1 className="text-3xl font-light text-gray-700 tracking-wide flex-1">
            สั่งซื้อสินค้า
          </h1>

          {/* ปุ่มกลับหน้าแรก */}
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-lg bg-red-300 hover:bg-gray-300 transition text-gray-700"
            title="หน้าแรก"
          >
            หน้าแรก
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <OrderProductCard key={p.productId} product={p} onAdd={addToCart} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Cart */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-white/70 backdrop-blur shadow-lg border border-white/50">
            <h2 className="font-light text-2xl mb-4 text-gray-700 flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-sm font-medium">
                {totalQuantity}
              </span>
              ตะกร้าสินค้า
            </h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg font-light">ยังไม่มีสินค้าในตะกร้า</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-[280px] overflow-y-auto mb-6 pr-3">
                  {cart.map((c, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100/50 group hover:shadow-md transition">
                      <div className="flex-1">
                        <div className="font-medium text-gray-700 text-sm">{c.sku}</div>
                        <div className="text-xs text-gray-400 mt-1">{c.size} • {c.price.toLocaleString()} ฿</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-700 text-sm w-20 text-right">
                          {(c.price * c.quantity).toLocaleString()} ฿
                        </span>
                        <button 
                          onClick={() => removeFromCart(i)}
                          className="p-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-pink-100/30 to-purple-100/30 border border-pink-100/50">
                  <div className="flex justify-between text-sm text-gray-600 font-light">
                    <span>รวมค่าสินค้า</span>
                    <span className="text-gray-700 font-medium">{subtotal.toLocaleString()} ฿</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 font-light">
                    <span>ค่าจัดส่ง</span>
                    <span className="text-gray-700 font-medium">{shippingCost.toLocaleString()} ฿</span>
                  </div>
                  <div className="border-t border-pink-200/50 pt-3 mt-3 flex justify-between items-center">
                    <span className="text-gray-700 font-light">ยอดชำระรวม</span>
                    <span className="text-2xl font-light text-pink-500">{grandTotal.toLocaleString()} ฿</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Form */}
          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur shadow-lg border border-white/50 h-fit">
            <h2 className="font-light text-2xl mb-5 text-gray-700">ข้อมูลจัดส่ง</h2>
            <div className="space-y-4">
              {formFields.map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-gray-500 mb-2 block uppercase tracking-wide">
                    {f.label} {f.required && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    placeholder={f.label}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-light bg-white border transition focus:outline-none
                      ${errors[f.key] 
                        ? "border-red-300 focus:ring-2 focus:ring-red-200 bg-red-50/30" 
                        : "border-gray-200 focus:ring-2 focus:ring-pink-200"
                      }`}
                    value={form[f.key]}
                    onChange={(e) => {
                      setForm({ ...form, [f.key]: e.target.value });
                      if (errors[f.key]) {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors[f.key];
                          return newErrors;
                        });
                      }
                    }}
                  />
                  {errors[f.key] && (
                    <p className="text-red-400 text-xs mt-1 font-light">{errors[f.key]}</p>
                  )}
                </div>
              ))}
              
              <button
                onClick={onSubmit}
                disabled={cart.length === 0}
                className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl transition font-light text-sm
                  ${cart.length === 0 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-pink-300 to-rose-300 text-white hover:shadow-lg hover:from-pink-400 hover:to-rose-400 active:scale-95"
                  }`}
              >
                <Send size={16} />
                ยืนยันคำสั่งซื้อ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
