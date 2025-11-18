"use client";

import { useEffect, useState } from "react";
import { authGet } from "@/lib/authApi";
import { authGetCookie } from "@/lib/authApi";
import OrderCard from "@/components/user/OrderCard";
import { Package, Menu, X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface Order {
  _id: string;
  userId: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface FetchResponse {
  status: number;
  orders?: Order[];
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
  "": { label: "ทั้งหมด", color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50", icon: "📦" },
  pending_payment: { label: "รอชำระเงิน", color: "from-amber-500 to-amber-600", bgColor: "bg-amber-50", icon: "⏳" },
  verifying_payment: { label: "ตรวจสอบ", color: "from-cyan-500 to-cyan-600", bgColor: "bg-cyan-50", icon: "🔍" },
  paid: { label: "ชำระแล้ว", color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50", icon: "✅" },
  shipping: { label: "กำลังส่ง", color: "from-pink-500 to-pink-600", bgColor: "bg-pink-50", icon: "🚚" },
  completed: { label: "สำเร็จ", color: "from-emerald-500 to-emerald-600", bgColor: "bg-emerald-50", icon: "🎉" },
};

export default function UserOrdersPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchOrders = async (s?: string): Promise<void> => {
    setLoading(true);
    setMobileMenuOpen(false);

    const url = s
      ? `${API_URL}/orders/user?status=${s}`
      : `${API_URL}/orders/user`;

    const localToken = localStorage.getItem("auth_token");

    let res: FetchResponse;
    if (localToken) {
      res = await authGet(url);
    } else {
      res = await authGetCookie(url);
    }

    setLoading(false);

    if (res.status === 200 && res.orders) {
      setOrders(res.orders);
    } else if (res.status === 401) {
      router.push("/user_auth/login");
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      await fetchOrders();
    };
    loadOrders();
  }, []);

  const handleStatusFilter = (key: string) => {
    setStatus(key);
    fetchOrders(key);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-6 lg:py-10 px-3 lg:px-4">
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
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 shadow-lg flex-shrink-0 backdrop-blur-sm">
              <Package className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                ประวัติการสั่งซื้อ
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                จัดการและติดตามคำสั่งซื้อของคุณ
              </p>
            </div>
          </div>
        </div>

        {/* Status Filters - Desktop */}
        <div className="hidden sm:block mb-8 lg:mb-10 fade-in-1">
          <div className="flex flex-wrap gap-3 p-6 lg:p-8 bg-white rounded-3xl shadow-xl backdrop-blur-xl border border-white/80">
            {Object.entries(statusConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => handleStatusFilter(key)}
                className={`relative group px-4 sm:px-5 lg:px-6 py-2.5 lg:py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm flex items-center gap-2 border-2 overflow-hidden ${
                  status === key
                    ? `border-transparent bg-gradient-to-r ${config.color} text-white shadow-lg shadow-indigo-300/40`
                    : `border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-gradient-to-r hover:${config.bgColor}`
                }`}
              >
                <span className="text-base sm:text-lg relative z-10">{config.icon}</span>
                <span className="relative z-10">{config.label}</span>
                {status === key && (
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filters - Mobile */}
        <div className="sm:hidden mb-6 fade-in-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold flex items-center justify-between hover:from-indigo-600 hover:to-blue-700 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{statusConfig[status]?.icon || "📦"}</span>
                <span className="text-sm">
                  {status === "" ? "ทั้งหมด" : statusConfig[status]?.label || "เลือกสถานะ"}
                </span>
              </span>
              <ChevronDown 
                className={`w-5 h-5 transition-transform duration-300 ${mobileMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {mobileMenuOpen && (
              <div className="slide-down grid grid-cols-2 gap-2 p-3 bg-gradient-to-br from-gray-50 to-blue-50">
                {Object.entries(statusConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleStatusFilter(key)}
                    className={`py-2 px-3 rounded-xl transition-all duration-300 border-2 font-medium text-xs flex flex-col items-center gap-1 ${
                      status === key
                        ? `bg-gradient-to-br ${config.color} text-white border-transparent shadow-lg`
                        : `bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-gradient-to-br hover:${config.bgColor}`
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
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-75 pulse-soft"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <div className="animate-spin">
                    <Package className="w-8 h-8 text-indigo-500" />
                  </div>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 font-semibold">
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
              <div className="flex flex-col items-center justify-center py-16 lg:py-20 bg-white rounded-3xl shadow-xl border border-gray-100 px-4">
                <div className="text-6xl sm:text-7xl mb-6 opacity-90">📭</div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 text-center">
                  ยังไม่มีคำสั่งซื้อ
                </p>
                <p className="text-sm sm:text-base text-gray-500 text-center max-w-sm mb-8">
                  คุณยังไม่มีคำสั่งซื้อในสถานะนี้ เริ่มการช้อปปิ้งและสร้างคำสั่งแรกของคุณ
                </p>
                <button
                  onClick={() => router.push("/products")}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
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