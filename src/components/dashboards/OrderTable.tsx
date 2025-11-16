// components/dashboard/OrderTable.tsx
import { Order } from '@/hooks/useDashboard';

export function OrderTable({ orders }: { orders: Order[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">ออเดอร์ล่าสุด</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">ลูกค้า</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">จำนวนเงิน</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">{order.customerName}</td>
                  <td className="px-4 py-3 text-gray-900 font-semibold">
                    ฿{(order.totalPrice || 0).toLocaleString('th-TH', { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'verifying_payment'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending_payment'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status === 'verifying_payment' && 'รอตรวจสอบ'}
                      {order.status === 'paid' && 'ชำระแล้ว'}
                      {order.status === 'pending_payment' && 'รอชำระเงิน'}
                      {!['verifying_payment', 'paid', 'pending_payment'].includes(order.status) && order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-3 text-center text-gray-600">
                  ไม่พบออเดอร์
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
