"use client";

import { useEffect, useState } from "react";
import { authGet } from "@/lib/authApi";
import OrderCard from "@/components/user/OrderCard";
import { Filter } from "lucide-react";

export default function UserOrdersPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (s?: string) => {
    setLoading(true);
    const url = s
      ? `${API_URL}/orders/user?status=${s}`
      : `${API_URL}/orders/user`;

    const res = await authGet(url);

    setLoading(false);

    if (res.status === 200) {
      setOrders(res.orders);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
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
            onClick={() => {
              setStatus(item.key);
              fetchOrders(item.key);
            }}
            className={`px-3 py-1 rounded-full border text-sm ${
              status === item.key ? "bg-black text-white" : "bg-white"
            }`}
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
          orders.map((order: any) => (
            <OrderCard key={order._id} order={order} />
          ))
        ) : (
          <p className="text-gray-500 text-center">
            ไม่มีคำสั่งซื้อในสถานะนี้
          </p>
        )}
      </div>
    </div>
  );
}
