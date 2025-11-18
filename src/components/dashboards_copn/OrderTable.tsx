// components/dashboard/OrderTable.tsx
import type { Order } from '@/hooks/useDashboard';

export function OrderTable({ orders }: { orders: Order[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return 'bg-blue-100 text-blue-800';
      case 'verifying_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'shipping':
        return 'bg-indigo-100 text-indigo-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending_payment: 'รอชำระเงิน',
      verifying_payment: 'รอตรวจสอบ',
      paid: 'ชำระแล้ว',
      shipping: 'จัดส่งแล้ว',
      completed: 'สำเร็จ',
      cancelled: 'ยกเลิก',
    };
    return labels[status] || status;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        ออเดอร์ล่าสุด ({orders.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">หมายเลขออเดอร์</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">ชื่อลูกค้า</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">เบอร์โทร</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">จำนวนเงิน</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">จำนวนสินค้า</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">สถานะ</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">วันที่สั่ง</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length > 0 ? (
              orders.map((order) => {
                const totalItems = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                const orderDate = new Date(order.createdAt);
                const dateStr = orderDate.toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-900 font-mono text-xs">
                      {order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {order.customerName || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {order.customerPhone || '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 font-semibold">
                      ฿{(order.totalPrice || 0).toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {totalItems}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {dateStr}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-3 text-center text-gray-600">
                  ไม่พบออเดอร์
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Stats Summary */}
      <div className="mt-6 pt-4 border-t grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <p className="text-gray-600 text-sm">รวมออเดอร์</p>
          <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm">รอชำระเงิน</p>
          <p className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'pending_payment' || o.status === 'verifying_payment').length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm">จัดส่งแล้ว</p>
          <p className="text-2xl font-bold text-indigo-600">
            {orders.filter(o => o.status === 'shipping').length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm">สำเร็จ</p>
          <p className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'completed').length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm">ยกเลิก</p>
          <p className="text-2xl font-bold text-red-600">
            {orders.filter(o => o.status === 'cancelled').length}
          </p>
        </div>
      </div>
    </div>
  );
}