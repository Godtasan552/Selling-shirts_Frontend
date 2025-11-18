"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OrderProductCard from "@/components/user/productCard";
import { post } from "@/lib/authApi";
import { Receipt, Send, Trash2, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";

// ==================== Types ====================
interface Product {
  productId: string;
  name: string;
  size: string;
  price: number;
  sku: string;
  quantity?: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface OrderForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  note: string;
}

type FormErrors = Partial<Record<keyof OrderForm, string>>;

// ==================== Component ====================
export default function OrderPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<OrderForm>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    note: "",
  });

  // ==================== Load Products ====================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/public/home-stats`);
        const data = await res.json();

        if (data.success) {
          setProducts(data.stats.products);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [API_URL]);

  // ==================== Cart Actions ====================
  const addToCart = (item: Product) => {
    const coerced: CartItem = {
      ...item,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    };
    setCart((prev) => [...prev, coerced]);
  };

  const removeFromCart = (indexToRemove: number) => {
    setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = totalQuantity > 0 ? 50 + (totalQuantity - 1) * 10 : 0;
  const grandTotal = subtotal + shippingCost;

  // ==================== Form Validation ====================
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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

  // ==================== Submit Order ====================
  const onSubmit = async () => {
    if (cart.length === 0) {
      alert("กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้น");
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const res = await post(`${API_URL}/orders/create`, {
        ...form,
        items: cart,
        totalPrice: grandTotal,
        shippingCost: shippingCost,
      });

      if (res.status === 201 || res.status === 200) {
        const orderId = res.data?.order?._id;

        if (!orderId) {
          alert("ไม่พบ Order ID จาก API");
          return;
        }

        router.push(
          `/order/uploadslip?id=${orderId}&total=${grandTotal}&shipping=${shippingCost}&subtotal=${subtotal}`
        );
      } else {
        alert("เกิดข้อผิดพลาดในการสร้าง Order");
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== Render ====================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="กลับไป"
            >
              <ArrowLeft size={24} className="text-gray-900" />
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
              <Receipt size={28} />
              สั่งซื้อสินค้า
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Products Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">เลือกสินค้า</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((p) => (
                <OrderProductCard key={p.productId} product={p} onAdd={addToCart} />
              ))}
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Section */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 space-y-4">
              <div>
                <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  🛒 ตะกร้าสินค้า
                  {cart.length > 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                      {totalQuantity}
                    </span>
                  )}
                </h2>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">ยังไม่มีสินค้าในตะกร้า</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="max-h-64 overflow-y-auto space-y-3 pr-2 border-b border-gray-200 pb-4">
                    {cart.map((c, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-start gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">{c.sku}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {c.size} | {c.quantity}x
                          </div>
                          <div className="text-sm font-semibold text-gray-900 mt-1">
                            ฿{(c.price * c.quantity).toLocaleString("th-TH")}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(i)}
                          className="p-1.5 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded transition flex-shrink-0"
                          title="ลบ"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>ค่าสินค้า</span>
                      <span className="font-medium">฿{subtotal.toLocaleString("th-TH")}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>ค่าจัดส่ง</span>
                      <span className="font-medium">฿{shippingCost.toLocaleString("th-TH")}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <span className="font-semibold text-gray-900">รวมทั้งสิ้น</span>
                      <span className="text-2xl font-bold text-green-600">
                        ฿{grandTotal.toLocaleString("th-TH")}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-5">
              <h2 className="font-bold text-lg text-gray-900">📋 ข้อมูลจัดส่ง</h2>

              <div className="space-y-4">
                {(
                  [
                    { key: "customerName", label: "ชื่อ-นามสกุล", required: true, placeholder: "เช่น สมชาย ใจดี" },
                    { key: "customerPhone", label: "เบอร์โทร", required: true, placeholder: "เช่น 0812345678" },
                    { key: "customerEmail", label: "อีเมล", required: true, placeholder: "เช่น email@example.com" },
                    { key: "customerAddress", label: "ที่อยู่จัดส่ง", required: true, placeholder: "อพ.*** ซ.*** ถ.*** ..." },
                    { key: "note", label: "หมายเหตุ", required: false, placeholder: "เช่น ให้ฝากเพื่อนบ้านครับ" },
                  ] as const
                ).map((f) => (
                  <div key={f.key}>
                    <label className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                      {f.label}
                      {f.required && <span className="text-red-500">*</span>}
                    </label>
                    {f.key === "customerAddress" ? (
                      <textarea
                        placeholder={f.placeholder}
                        className={`border p-3 w-full rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 resize-none transition
                          ${
                            errors[f.key as keyof OrderForm]
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-gray-900"
                          }`}
                        value={form[f.key as keyof OrderForm]}
                        onChange={(e) => {
                          const key = f.key as keyof OrderForm;
                          setForm({ ...form, [key]: e.target.value });
                          if (errors[key]) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors[key];
                              return newErrors;
                            });
                          }
                        }}
                        rows={3}
                      />
                    ) : (
                      <input
                        type={f.key === "customerEmail" ? "email" : "text"}
                        placeholder={f.placeholder}
                        className={`border p-3 w-full rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 transition
                          ${
                            errors[f.key as keyof OrderForm]
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-gray-900"
                          }`}
                        value={form[f.key as keyof OrderForm]}
                        onChange={(e) => {
                          const key = f.key as keyof OrderForm;
                          setForm({ ...form, [key]: e.target.value });
                          if (errors[key]) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors[key];
                              return newErrors;
                            });
                          }
                        }}
                      />
                    )}
                    {errors[f.key as keyof OrderForm] && (
                      <div className="flex items-center gap-1.5 text-red-600 text-xs mt-1.5">
                        <AlertCircle size={14} />
                        {errors[f.key as keyof OrderForm]}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Shipping Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <p className="font-medium mb-1">📦 ข้อมูลค่าจัดส่ง:</p>
                <ul className="text-xs space-y-0.5 text-blue-800">
                  <li>• ชิ้นแรก: 50 บาท</li>
                  <li>• ชิ้นที่ 2 เป็นต้นไป: +10 บาท/ชิ้น</li>
                  <li>• ส่งฟรีทั่วประเทศ</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                onClick={onSubmit}
                disabled={cart.length === 0 || submitting}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-white
                  ${
                    cart.length === 0 || submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-900 hover:bg-black shadow-lg active:shadow-md"
                  }`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    กำลังส่ง...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    ยืนยันคำสั่งซื้อ • ฿{grandTotal.toLocaleString("th-TH")}
                  </>
                )}
              </button>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}