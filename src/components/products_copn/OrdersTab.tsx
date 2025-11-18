// ============================================
// components/admin/OrdersTab.tsx
// ============================================
import { useState } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import Image from 'next/image';
import type { Order } from '@/types/product_admin';
import { ORDER_STATUS } from '@/types/product_admin';
import clsx from 'clsx';

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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const handleSelectStatus = (status: string) => {
    setFilterStatus(status);
    setDropdownOpen(false); // ปิด dropdown หลังเลือก
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>

        {/* Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="btn btn-outline bg-white text-gray-800 border-gray-300 px-4 py-2 rounded-lg w-full sm:w-auto text-left flex justify-between items-center"
          >
            {filterStatus === 'all'
              ? 'All Status'
              : ORDER_STATUS[filterStatus as keyof typeof ORDER_STATUS].label}
            <ChevronDown size={18} className={clsx('ml-2 transition-transform', dropdownOpen && 'rotate-180')} />
          </button>

          {dropdownOpen && (
            <ul className="absolute top-full left-0 mt-1 menu p-2 shadow bg-white rounded-box w-full sm:w-52 text-gray-800 z-50">
              <li>
                <a onClick={() => handleSelectStatus('all')}>All Status</a>
              </li>
              {Object.entries(ORDER_STATUS).map(([key, val]) => (
                <li key={key}>
                  <a onClick={() => handleSelectStatus(key)}>
                    {val.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error shadow-lg mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Loading / No Orders */}
      {loading ? (
        <div className="text-center py-12 animate-pulse">
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

  const statusConfig = ORDER_STATUS[order.status as keyof typeof ORDER_STATUS];

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
    <div
      className={clsx(
        'rounded-lg shadow border transition-all duration-300 overflow-hidden',
        isSelected ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200',
        'hover:scale-[1.01] hover:shadow-lg'
      )}
    >
      {/* Header */}
      <div
        onClick={onToggle}
        className={clsx(
          'p-4 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center transition-colors duration-300',
          isSelected ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-50'
        )}
      >
        <div className="flex-1 mb-2 sm:mb-0">
          <h3 className="font-semibold text-gray-900">{order.customerName}</h3>
          <p className="text-sm text-gray-600">Order ID: {order._id.slice(-8)}</p>
          <p className="text-sm text-gray-600">{order.customerPhone}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              ฿{order.totalPrice?.toFixed(2) || '0.00'}
            </p>
            <span
              className={clsx(
                'px-3 py-1 rounded-full text-xs font-medium inline-block',
                statusConfig?.color || 'bg-gray-100 text-gray-800'
              )}
            >
              {statusConfig?.label || order.status}
            </span>
          </div>

          <ChevronDown
            size={20}
            className={clsx('transition-transform duration-300', isExpanded ? 'rotate-180' : '')}
          />
        </div>
      </div>

      {/* Expanded Section with animation */}
      <div
        className={clsx(
          'transition-all duration-500 overflow-hidden',
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t p-4 bg-gray-50 space-y-4">
          {/* Items */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-x-auto">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="text-sm text-gray-600 p-2 bg-white rounded-lg shadow-sm"
                >
                  {item.name} - Size: {item.size} (x{item.quantity}) - ฿
                  {(item.price * item.quantity).toFixed(2)}
                  <p className="text-sm text-gray-600">
                    Shipping: ฿{order.shippingCost?.toFixed(2) || '0.00'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-t pt-4">
            <div className="space-y-2 bg-white p-3 rounded-lg shadow-sm border overflow-x-auto">
              <p className="text-sm text-gray-800">
                <strong>Address:</strong> {order.customerAddress}
              </p>
              <p className="text-sm text-gray-800">
                <strong>Email:</strong> {order.customerEmail}
              </p>
            </div>
          </div>

          {/* Payment Slip */}
          {order.paymentSlip && (
            <div className="border-t pt-4">
              <p className="font-semibold text-gray-900 mb-3">📸 Payment Slip</p>
              <PaymentSlipImage src={order.paymentSlip} />

              {!isConfirmed && order.status === 'verifying_payment' ? (
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className="flex-1 btn btn-success gap-2"
                  >
                    <Check size={18} /> {isConfirming ? 'Confirming...' : 'Confirm'}
                  </button>

                  <button
                    onClick={handleReject}
                    disabled={isRejecting}
                    className="flex-1 btn btn-error gap-2"
                  >
                    <X size={18} /> Reject
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
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Update Status
                </label>
                <select
                  value={order.status}
                  onChange={(e) => onUpdateStatus(e.target.value)}
                  className="select select-bordered w-full bg-gray-100 text-gray-700 border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200"
                >
                  <option value="paid">Paid</option>
                  <option value="shipping">Shipping</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Payment Slip Image ---
function PaymentSlipImage({ src }: { src: string }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full max-w-[400px] h-72 mb-4 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden shadow">
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
