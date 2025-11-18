// components/dashboard/ProductTable.tsx
import { Package } from 'lucide-react';
import type { IProduct } from '@/hooks/useDashboard';

export function ProductTable({ products }: { products: IProduct[] }) {
  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Package className="w-5 h-5" />
          สินค้า ({products.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">ชื่อสินค้า</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">หมวดหมู่</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">จำนวนรายการ</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">ราคา (ต่ำ - สูง)</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">สต็อกรวม</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length > 0 ? (
              products.map((product) => {
                const prices = product.variants.map(v => v.price);
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                const totalStock = product.variants.reduce((sum, v) => sum + (v.quantity || 0), 0);

                return (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-900 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-gray-600">{product.category}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{product.variants.length}</td>
                    <td className="px-4 py-3 text-center text-gray-900 font-semibold">
                      ฿{minPrice.toLocaleString('th-TH', { maximumFractionDigits: 0 })} - ฿{maxPrice.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'inactive'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.status === 'active' && 'เปิดใช้งาน'}
                        {product.status === 'inactive' && 'ปิดใช้งาน'}
                        {product.status === 'discontinued' && 'หยุดจำหน่าย'}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center text-gray-600">
                  ไม่พบสินค้า
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}