"use client";

import { Package, Truck, Clock, CheckCircle, LucideIcon } from "lucide-react";

// ✅ Define Status Type
type OrderStatus = "pending_payment" | "verifying_payment" | "shipping" | "paid" | "completed";

interface StatusStyle {
  icon: LucideIcon;
  color: string;
  label: string;
}

interface Order {
  _id: string;
  status: OrderStatus;
  createdAt: string;
  shippingCost?: number;
  customerAddress?: string;
  totalPrice: number;
}

// ✅ Type the statusStyles object
const statusStyles: Record<OrderStatus, StatusStyle> = {
  pending_payment: { 
    icon: Clock, 
    color: "text-yellow-500", 
    label: "รอชำระเงิน" 
  },
  verifying_payment: { 
    icon: Clock, 
    color: "text-blue-500", 
    label: "รอตรวจสอบ" 
  },
  shipping: { 
    icon: Truck, 
    color: "text-purple-500", 
    label: "กำลังจัดส่ง" 
  },
  paid: { 
    icon: Package, 
    color: "text-green-500", 
    label: "ชำระเงินแล้ว" 
  },
  completed: { 
    icon: CheckCircle, 
    color: "text-emerald-600", 
    label: "สำเร็จ" 
  },
};

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const statusStyle = statusStyles[order.status];
  const StatusIcon = statusStyle?.icon;
  const statusColor = statusStyle?.color;
  const statusLabel = statusStyle?.label;

  if (!statusStyle) {
    return <div>Unknown status: {order.status}</div>;
  }

  return (
    <div className="p-5 rounded-2xl bg-white/60 backdrop-blur border border-white/50 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-light text-lg text-gray-700">Order #{order._id.slice(-6)}</h3>
        <span className={`flex items-center gap-1 text-sm font-medium ${statusColor}`}>
          <StatusIcon size={16} />
          {statusLabel}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600 font-light">
        <p>วันที่สั่งซื้อ: {new Date(order.createdAt).toLocaleString("th-TH")}</p>
        <p>ค่าจัดส่ง: {order.shippingCost?.toLocaleString("th-TH")} บาท</p>
        <p>จัดส่งที่: {order.customerAddress}</p>
        <p className="font-semibold text-gray-800">
          ยอดรวม: {order.totalPrice.toLocaleString("th-TH")} บาท
        </p>
      </div>
    </div>
  );
}