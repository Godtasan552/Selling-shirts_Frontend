"use client";

import { useEffect, useState } from "react";
import { authGet } from "@/lib/authApi";
import { authGetCookie } from "@/lib/authApi";
import OrderCard from "@/components/user/OrderCard";
import { Package, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

// ✅ Define OrderStatus type
type OrderStatus = "pending_payment" | "verifying_payment" | "shipping" | "paid" | "completed";

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

// ✅ Update Order interface with proper status type
interface Order {
  _id: string;
  userId: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingCost?: number;
  customerAddress?: string;
}

// ✅ Update FetchResponse to match authApi structure
interface FetchResponse {
  status: number;
  data?: {
    orders?: Order[];
  };
}

// ✅ Define StatusConfig type
interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

const statusConfig: Record<string | OrderStatus, StatusConfig> = {
  "": { label: "ทั้งหมด", color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50", icon: "📦" },
  pending_payment: { label: "รอชำระเงิน", color: "from-amber-500 to-amber-600", bgColor: "bg-amber-50", icon: "⏳" },
  verifying_payment: { label: "ตรวจสอบ", color: "from-cyan-500 to-cyan-600", bgColor: "bg-cyan-50", icon: "🔍" },
  paid: { label: "ชำระแล้ว", color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50", icon: "✅" },
  shipping: { label: "กำลังส่ง", color: "from-pink-500 to-pink-600", bgColor: "bg-pink-50", icon: "🚚" },
  completed: { label: "สำเร็จ", color: "from-emerald-500 to-emerald-600", bgColor: "bg-emerald-50", icon: "🎉" },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function UserOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<string | OrderStatus>("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchOrders = async (s: string | OrderStatus): Promise<void> => {
    setLoading(true);
    setMobileMenuOpen(false);

    const url = `${API_URL}/orders/user?status=${s}`;
    const localToken = localStorage.getItem("auth_token");

    let res: FetchResponse;
    if (localToken) {
      res = await authGet<{ orders: Order[] }>(url);
    } else {
      res = await authGetCookie<{ orders: Order[] }>(url);
    }

    setLoading(false);

    if (res.status === 200 && res.data?.orders) {
      setOrders(res.data.orders);
    } else if (res.status === 401) {
      router.push("/user_auth/login");
    }
  };

  useEffect(() => {
    // ✅ Use a mounted flag to avoid cascading renders
    let isMounted = true;

    const loadOrders = async () => {
      setLoading(true);

      const url = `${API_URL}/orders/user`;
      const localToken = localStorage.getItem("auth_token");

      let res: FetchResponse;
      if (localToken) {
        res = await authGet<{ orders: Order[] }>(url);
      } else {
        res = await authGetCookie<{ orders: Order[] }>(url);
      }

      if (!isMounted) return;

      if (res.status === 200 && res.data?.orders) {
        setOrders(res.data.orders);
      } else if (res.status === 401) {
        router.push("/user_auth/login");
      }
      setLoading(false);
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleStatusFilter = (key: string | OrderStatus) => {
    setStatus(key);
    fetchOrders(key as OrderStatus);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-6 lg:py-10 px-3 lg:px-4">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .fade-in-0 { animation: fadeInUp 0.6s ease-out 0s forwards; opacity: 0; }
        .fade-in-1 { animation: fadeInUp 0.6s ease-out 0.1s forwards; opacity: 0; }
        .fade-in-2 { animation: fadeInUp 0.6s ease-out 0.2s forwards; opacity: 0; }
        .fade-in-3 { animation: fadeInUp 0.6s ease-out 0.3s forwards; opacity: 0; }
        .fade-in-4 { animation: fadeInUp 0.6s ease-out 0.4s forwards; opacity: 0; }
        .fade-in-5 { animation: fadeInUp 0.6s ease-out 0.5s forwards; opacity: 0; }
        .slide-down { animation: slideDown 0.3s ease-out forwards; }
        .pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }
      `}</style>

      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 lg:mb-10 fade-in-0">
          <div className="flex items-center justify-between gap-3 sm:gap-4 mb-3">
            <div className="flex items-center gap-3 sm:gap-4 flex-1">
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-pink-200 to-rose-200 shadow-lg flex-shrink-0 backdrop-blur-sm">
                <Package className="w-6 h-6 sm:w-7 sm:h-7 text-pink-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-700">
                  ประวัติการสั่งซื้อ
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 font-light">
                  จัดการและติดตามคำสั่งซื้อของคุณ
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl sm:rounded-2xl font-light hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 hover:shadow-lg hover:scale-105 text-xs sm:text-sm flex-shrink-0 whitespace-nowrap"
            >
              ← กลับหน้าแรก
            </button>
          </div>
        </div>

        {/* Status Filters - Desktop */}
        <div className="hidden sm:block mb-8 lg:mb-10 fade-in-1">
          <div className="flex flex-wrap gap-3 p-6 lg:p-8 bg-white/70 backdrop-blur rounded-3xl shadow-lg border border-white/50">
            {Object.entries(statusConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleStatusFilter(key as OrderStatus)}
                className={`px-4 sm:px-5 lg:px-6 py-2.5 lg:py-3 rounded-2xl font-light transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm flex items-center gap-2 border-2 ${
                  status === key
                    ? `border-transparent bg-gradient-to-r from-pink-300 to-rose-300 text-white shadow-lg`
                    : `border-gray-200 bg-white text-gray-700 hover:border-pink-300 hover:bg-pink-50`
                }`}
              >
                <span className="text-base sm:text-lg">{config.icon}</span>
                <span>{config.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Filters - Mobile */}
        <div className="sm:hidden mb-6 fade-in-1">
          <div className="bg-white/70 backdrop-blur rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full px-4 py-3 bg-gradient-to-r from-pink-300 to-rose-300 text-white font-light flex items-center justify-between hover:from-pink-400 hover:to-rose-400 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{statusConfig[status]?.icon || "📦"}</span>
                <span className="text-sm">
                  {status === "" ? "ทั้งหมด" : statusConfig[status as OrderStatus]?.label || "เลือกสถานะ"}
                </span>
              </span>
              <ChevronDown 
                className={`w-5 h-5 transition-transform duration-300 ${mobileMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {mobileMenuOpen && (
              <div className="slide-down grid grid-cols-2 gap-2 p-3 bg-gradient-to-br from-pink-50 to-purple-50">
                {Object.entries(statusConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleStatusFilter(key as OrderStatus)}
                    className={`py-2 px-3 rounded-xl transition-all duration-300 border-2 font-light text-xs flex flex-col items-center gap-1 ${
                      status === key
                        ? `bg-gradient-to-br from-pink-300 to-rose-300 text-white border-transparent shadow-lg`
                        : `bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50`
                    }`}
                  >
                    <span className="text-lg">{config.icon}</span>
                    <span>{config.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-16 lg:py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-75 pulse-soft"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <div className="animate-spin">
                    <Package className="w-8 h-8 text-pink-500" />
                  </div>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 font-light">
                กำลังโหลดคำสั่งซื้อ...
              </p>
            </div>
          </div>
        )}

        {/* Order List */}
        {!loading && (
          <div className="space-y-4 lg:space-y-5 fade-in-2">
            {orders.length > 0 ? (
              orders.map((order, idx) => (
                <div
                  key={order._id}
                  className={`fade-in-${Math.min(3 + idx, 5)}`}
                >
                  <OrderCard order={order} />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 lg:py-20 bg-white/70 backdrop-blur rounded-3xl shadow-lg border border-white/50 px-4">
                <div className="text-6xl sm:text-7xl mb-6 opacity-90">📭</div>
                <p className="text-lg sm:text-xl lg:text-2xl font-light text-gray-700 mb-2 text-center">
                  ยังไม่มีคำสั่งซื้อ
                </p>
                <p className="text-sm sm:text-base text-gray-400 text-center max-w-sm mb-8 font-light">
                  คุณยังไม่มีคำสั่งซื้อในสถานะนี้ เริ่มการช้อปปิ้งและสร้างคำสั่งแรกของคุณ
                </p>
                <button
                  onClick={() => router.push("/products")}
                  className="px-8 py-3 bg-gradient-to-r from-pink-300 to-rose-300 text-white rounded-xl font-light hover:from-pink-400 hover:to-rose-400 transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
                >
                  ไปเลือกสินค้า
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}