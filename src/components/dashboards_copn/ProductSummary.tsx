// components/dashboard/ProductSummary.tsx
import { TrendingUp } from 'lucide-react';
import type { DashboardStats } from '@/hooks/useDashboard';

export function ProductSummary({ stats }: { stats: DashboardStats | null }) {
  if (!stats) return null;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        สรุปสินค้า
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-3 border-b">
          <span className="text-gray-600">รวมสินค้าทั้งหมด</span>
          <span className="text-2xl font-bold text-blue-600">{stats.totalProducts}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b">
          <span className="text-gray-600">สต็อกรวมทั้งหมด</span>
          <span className="text-2xl font-bold text-green-600">{stats.totalInventory}</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b">
          <span className="text-gray-600">ราคาเฉลี่ยต่อสินค้า</span>
          <span className="text-2xl font-bold text-orange-600">฿{stats.averageProductPrice.toLocaleString('th-TH', { maximumFractionDigits: 0 })}</span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-gray-600">มูลค่ารวมของสินค้า</span>
          <span className="text-2xl font-bold text-purple-600">฿{stats.totalRevenue.toLocaleString('th-TH', { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
    </div>
  );
}
