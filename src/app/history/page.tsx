"use client";

import { useEffect, useState, useCallback } from "react";
import { authGet, authGetCookie } from "@/lib/authApi";
import OrderCard from "@/components/user/OrderCard";
import { Filter } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the Order type
interface Order {
  _id: string;
  // กำหนด properties ที่แน่นอนของ Order
  status?: string;
  total?: number;
  [key: string]: unknown; // แทน any
}

export default function UserOrdersPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // useCallback ทำให้ fetchOrders stable reference
  const fetchOrders = useCallback(async (s?: string) => {
    setLoading(true);

    const url = s
      ? `${API_URL}/orders/user?status=${s}`
      : `${API_URL}/orders/user`;

    const localToken = localStorage.getItem("auth_token");

    let res: { status: number; orders?: Order[] };
    if (localToken) {
      res = await authGet<{ orders: Order[] }>(url);
    } else {
      res = await authGetCookie<{ orders: Order[] }>(url);
    }

    setLoading(false);

    if (res.status === 200 && res.orders) {
      setOrders(res.orders);
    } else if (res.status === 401) {
      router.push("/user_auth/login");
    }
  }, [API_URL, router]);

  // useEffect เรียก fetchOrders ครั้งแรก
useEffect(() => {
  // ใช้ IIFE async
  (async () => {
    await fetchOrders();
  })();
}, []); // ไม่ต้องใส่ fetchOrders เป็น dependency


  const handleFilterClick = (filterKey: string) => {
    setStatus(filterKey);
    fetchOrders(filterKey);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white text-black dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Filter /> ประวัติการสั่งซื้อ
      </h1>

      {/* Filters */}
      <div className="flex gap-2 mb-5 overflow-x-auto">
        {[
          { key: "", label: "ทั้งหมด" },
          { key: "pending_payment", label: "รอชำระเงิน" },
          { key: "verifying_payment", label: "ตรวจสอบ" },
          { key: "paid", label: "ชำระแล้ว" },
          { key: "shipping", label: "กำลังส่ง" },
          { key: "completed", label: "สำเร็จ" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => handleFilterClick(item.key)}
            className={`px-3 py-1 rounded-full border text-sm transition
              ${
                status === item.key
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-white text-black dark:bg-gray-700 dark:text-white"
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-center text-gray-500">กำลังโหลด...</p>}

      {/* Order List */}
      <div className="grid gap-4 mt-4">
        {orders.length > 0 ? (
          orders.map((order) => <OrderCard key={order._id} order={order} />)
        ) : (
          <p className="text-gray-500 text-center">
            ไม่มีคำสั่งซื้อในสถานะนี้
          </p>
        )}
      </div>
    </div>
  );
}
