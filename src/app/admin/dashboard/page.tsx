'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { StatCard } from '@/components/dashboards/StatCard';
import { ProductTable } from '@/components/dashboards/ProductTable';
import { ProductSummary } from '@/components/dashboards/ProductSummary';
import { OrderTable } from '@/components/dashboards/OrderTable';
import { UserTable } from '@/components/dashboards/UserTable';
import { LoadingState } from '@/components/dashboards/LoadingState';
import { ErrorState } from '@/components/dashboards/ErrorState';

export default function DashboardPage() {
  const { stats, products, orders, users, loading, error } = useDashboard();

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
          title="จำนวนผู้ใช้ทั้งหมด" 
          value={stats?.totalUsers?.toLocaleString() || '0'} 
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
          color="bg-indigo-500" 
        />
        <StatCard 
          title="ราคาเฉลี่ยต่อสินค้า" 
          value={`฿${(stats?.averageProductPrice || 0).toLocaleString('th-TH', { maximumFractionDigits: 0 })}`} 
          icon="💵" 
          color="bg-cyan-500" 
        />
        <StatCard 
          title="จำนวนออเดอร์ทั้งหมด" 
          value={stats?.totalOrders?.toLocaleString() || '0'} 
          icon="🛒" 
          color="bg-purple-500" 
        />
        <StatCard 
          title="มูลค่ารวมของสินค้า" 
          value={`฿${(stats?.totalRevenue || 0).toLocaleString('th-TH', { maximumFractionDigits: 0 })}`} 
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

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductTable products={products} />
        <ProductSummary stats={stats} />
      </div>

      {/* Orders and Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderTable orders={orders} />
        <UserTable users={users} />
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