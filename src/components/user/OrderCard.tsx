"use client";

import { Package, Truck, Clock, CheckCircle } from "lucide-react";

const statusStyles: any = {
  pending_payment: { icon: Clock, color: "text-yellow-500", label: "รอชำระเงิน" },
  verifying_payment: { icon: Clock, color: "text-blue-500", label: "รอตรวจสอบ" },
  shipping: { icon: Truck, color: "text-purple-500", label: "กำลังจัดส่ง" },
  paid: { icon: Package, color: "text-green-500", label: "ชำระเงินแล้ว" },
  completed: { icon: CheckCircle, color: "text-emerald-600", label: "สำเร็จ" },
};

export default function OrderCard({ order }: any) {
  const StatusIcon = statusStyles[order.status]?.icon;
  const statusColor = statusStyles[order.status]?.color;
  const statusLabel = statusStyles[order.status]?.label;

  return (
    <div
      className="
        p-4 rounded-lg border shadow hover:shadow-lg transition bg-white
        animate__animated animate__fadeInUp animate__faster
      "
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Order #{order._id.slice(-6)}</h3>

        <span className={`flex items-center gap-1 ${statusColor}`}>
          <StatusIcon size={18} /> {statusLabel}
        </span>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        <p>วันที่สั่งซื้อ: {new Date(order.createdAt).toLocaleString()}</p>

        {/* ใช้ totalPrice แทน total */}
        <p>ยอดรวม: {order.totalPrice.toLocaleString()} บาท</p>
      </div>
    </div>
  );
}

