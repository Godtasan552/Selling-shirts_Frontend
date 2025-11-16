'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { StatCard } from '@/components/dashboards/StatCard';
import { ProductTable } from '@/components/dashboards/ProductTable';
import { ProductSummary } from '@/components/dashboards/ProductSummary';
import { OrderTable } from '@/components/dashboards/OrderTable';

import { LoadingState } from '@/components/dashboards/LoadingState';
import { ErrorState } from '@/components/dashboards/ErrorState';

export default function DashboardPage() {
  const { stats, products, orders, loading, error } = useDashboard();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ยินดีต้อนรับเข้าสู่แอดมิน</h1>
        <p className="text-gray-600 mt-2">สรุปข้อมูลระบบและรายงาน</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="ผู้ดูแลทั้งหมด" 
          value={stats?.admins.total?.toLocaleString() || '0'} 
          icon="👨‍💼" 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="จำนวนผู้ใช้ทั้งหมด" 
          value={stats?.users.total?.toLocaleString() || '0'} 
          icon="👥" 
          color="bg-blue-500" 
        />
        <StatCard 
          title="จำนวนสินค้าทั้งหมด" 
          value={stats?.totalProducts?.toLocaleString() || '0'} 
          icon="📦" 
          color="bg-green-500" 
        />
        <StatCard 
          title="สต็อกทั้งหมด" 
          value={stats?.totalInventory?.toLocaleString() || '0'} 
          icon="📊" 
          color="bg-cyan-500" 
        />
        <StatCard 
          title="ราคาเฉลี่ยต่อสินค้า" 
          value={`฿${(stats?.averageProductPrice || 0).toLocaleString('th-TH', { maximumFractionDigits: 0 })}`} 
          icon="💵" 
          color="bg-yellow-500" 
        />
        <StatCard 
          title="จำนวนออเดอร์ทั้งหมด" 
          value={stats?.totalOrders?.toLocaleString() || '0'} 
          icon="🛒" 
          color="bg-purple-500" 
        />
        <StatCard 
          title="ยอดขายสินค้า" 
          value={`฿${(stats?.orderRevenue || 0).toLocaleString('th-TH', { maximumFractionDigits: 0 })}`} 
          icon="💰" 
          color="bg-orange-500" 
        />
        <StatCard 
          title="รอการตรวจสอบ" 
          value={stats?.pendingOrders?.toLocaleString() || '0'} 
          icon="⏳" 
          color="bg-red-500" 
        />
      </div>

      {/* Admin and User Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 สรุปผู้ดูแล</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">รวมทั้งหมด</span>
              <span className="text-2xl font-bold text-indigo-600">{stats?.admins.total || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">แอดมิน</span>
              <span className="text-xl font-bold text-red-600">{stats?.admins.admin || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">พนักงาน</span>
              <span className="text-xl font-bold text-purple-600">{stats?.admins.staff || 0}</span>
            </div>
          </div>
        </div>

        {/* User Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">👥 สรุปผู้ใช้</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">รวมทั้งหมด</span>
              <span className="text-2xl font-bold text-blue-600">{stats?.users.total || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">ยืนยันแล้ว</span>
              <span className="text-xl font-bold text-green-600">{stats?.users.verified || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">รอยืนยัน</span>
              <span className="text-xl font-bold text-yellow-600">{stats?.users.unverified || 0}</span>
            </div>
          </div>
        </div>

        {/* Sales Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 สรุปการขาย</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">ออเดอร์ที่ขายแล้ว</span>
              <span className="text-2xl font-bold text-green-600">{stats?.completedOrders || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">ยอดขาย</span>
              <span className="text-xl font-bold text-blue-600">฿{(stats?.orderRevenue || 0).toLocaleString('th-TH', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ออเดอร์รอตรวจสอบ</span>
              <span className="text-xl font-bold text-orange-600">{stats?.pendingOrders || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <ProductTable products={products} />
      </div>

      {/* Orders */}
      <div className="grid grid-cols-1 gap-6">
        <OrderTable orders={orders} />
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 ข้อมูลในแดชบอร์ดนี้อัปเดตแบบ real-time จากฐานข้อมูลของคุณ
        </p>
      </div>
    </div>
  );
}