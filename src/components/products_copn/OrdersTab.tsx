// ============================================
// components/admin/OrdersTab.tsx
// ============================================
import { useState } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import Image from 'next/image';
import type { Order } from '@/types/product_admin';
import { ORDER_STATUS } from '@/types/product_admin';

interface OrdersTabProps {
  orders: Order[];
  loading: boolean;
  error: string;
  onConfirmOrder: (orderId: string) => Promise<boolean>;
  onRejectOrder: (orderId: string) => Promise<boolean>;
  onUpdateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
}

export function OrdersTab({
  orders,
  loading,
  error,
  onConfirmOrder,
  onRejectOrder,
  onUpdateOrderStatus,
}: OrdersTabProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          {Object.entries(ORDER_STATUS).map(([key, val]) => (
            <option key={key} value={key}>
              {val.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              isExpanded={expandedOrder === order._id}
              isSelected={selectedOrder === order._id}
              onToggle={() => {
                setSelectedOrder(order._id);
                setExpandedOrder(expandedOrder === order._id ? null : order._id);
              }}
              onConfirm={() => onConfirmOrder(order._id)}
              onReject={() => onRejectOrder(order._id)}
              onUpdateStatus={(status) => onUpdateOrderStatus(order._id, status)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onConfirm: () => void;
  onReject: () => void;
  onUpdateStatus: (status: string) => void;
}

function OrderCard({
  order,
  isExpanded,
  isSelected,
  onToggle,
  onConfirm,
  onReject,
  onUpdateStatus,
}: OrderCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const statusConfig =
    ORDER_STATUS[order.status as keyof typeof ORDER_STATUS];

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      await onConfirm();
      setIsConfirmed(true);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);
      await onReject();
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className={`rounded-lg shadow transition-all border ${isSelected ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200'}`}>

      {/* Header */}
      <div onClick={onToggle} className={`p-4 cursor-pointer flex justify-between items-center transition-colors ${isSelected ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-50'}`}>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{order.customerName}</h3>
          <p className="text-sm text-gray-600">Order ID: {order._id.slice(-8)}</p>
          <p className="text-sm text-gray-600">{order.customerPhone}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-gray-900">฿{order.totalPrice?.toFixed(2) || '0.00'}</p>
            <p className="text-sm text-gray-600">Shipping: ฿{order.shippingCost?.toFixed(2) || '0.00'}</p>
            <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${statusConfig?.color || 'bg-gray-100 text-gray-800'}`}>
              {statusConfig?.label || order.status}
            </span>
          </div>

          <ChevronDown size={20} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="border-t p-4 bg-gray-50 space-y-4">

          {/* Items */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
            <div className="space-y-2">
              {order.items?.map((item, idx) => (
                <div key={idx} className="text-sm text-gray-600">
                  {item.name} - Size: {item.size} (x{item.quantity}) - ฿{(item.price * item.quantity).toFixed(2)}
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-t pt-4">
            <div className="space-y-2 bg-white p-3 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-800"><strong>Address:</strong> {order.customerAddress}</p>
              <p className="text-sm text-gray-800"><strong>Email:</strong> {order.customerEmail}</p>
              <p className="text-sm text-gray-800"><strong>Shipping:</strong> ฿{order.shippingCost?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          {/* Payment Slip */}
          {order.paymentSlip && (
            <div className="border-t pt-4">
              <p className="font-semibold text-gray-900 mb-3">📸 Payment Slip</p>
              <PaymentSlipImage src={order.paymentSlip} />

              {/* ปุ่มหรือข้อความสถานะ */}
              {!isConfirmed && order.status === 'verifying_payment' ? (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Check size={18} /> {isConfirming ? 'Confirming...' : 'Confirm'}
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={isRejecting}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <X size={18} /> {isRejecting ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              ) : (
                <p className="text-green-600 font-semibold flex items-center gap-2 mt-2">
                  <Check size={18} /> ตรวจสอบแล้ว
                </p>
              )}
            </div>
          )}

          {/* Status Update */}
          {['paid', 'shipping', 'completed'].includes(order.status) && (
            <div className="border-t pt-4">
              <div className="bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
                <label className="block text-sm font-medium text-gray-800 mb-2">Update Status</label>
                <select
                  value={order.status}
                  onChange={(e) => onUpdateStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="paid">Paid</option>
                  <option value="shipping">Shipping</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// --- Component แยกสำหรับ Payment Slip Image (fallback เป็นไอคอน X)
function PaymentSlipImage({ src }: { src: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-72 h-72 mb-4 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden shadow">
      {!imgError ? (
        <Image
          src={src}
          alt="Payment Slip"
          fill
          className="object-contain"
          priority
          unoptimized
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200 text-gray-500">
          <X size={48} />
          <span className="mt-2 text-sm">ไม่พบรูป</span>
        </div>
      )}
    </div>
  );
}
