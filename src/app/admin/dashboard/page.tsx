'use client';

import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  inventory?: number;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('accessToken');

        // Fetch products
        const productsResponse = await fetch(`${apiUrl}/api/products`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        
        const productsData = await productsResponse.json();
        const productsList = Array.isArray(productsData.data) ? productsData.data : [];
        setProducts(productsList.slice(0, 5)); // Show latest 5

        // Calculate stats
        const totalProducts = productsList.length;
        const totalRevenue = productsList.reduce((sum: number, p: Product) => sum + (p.price * (p.inventory || 0)), 0);

        setStats({
          totalUsers: 1234,
          totalProducts,
          totalOrders: 856,
          totalRevenue,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">กำลังโหลด dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">ข้อผิดพลาด: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ยินดีต้อนรับเข้าสู่แอดมิน</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          title="จำนวนออเดอร์ทั้งหมด" 
          value={stats?.totalOrders?.toLocaleString() || '0'} 
          icon="🛒" 
          color="bg-purple-500" 
        />
        <StatCard 
          title="รายได้ทั้งหมด" 
          value={`฿${(stats?.totalRevenue || 0).toLocaleString('th-TH', { maximumFractionDigits: 2 })}`} 
          icon="💰" 
          color="bg-orange-500" 
        />
      </div>

      {/* Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">สินค้าล่าสุด</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ชื่อสินค้า</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">หมวดหมู่</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ราคา</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{product.name || 'ไม่มีชื่อ'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.category || 'ไม่มีหมวดหมู่'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                        ฿{(product.price || 0).toLocaleString('th-TH', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.status === 'active' ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-sm text-gray-600">
                      ไม่พบสินค้า
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">สถิติด่วน</h3>
          <div className="space-y-4">
            <ProgressBar 
              label="สินค้าที่รายการ" 
              percentage={Math.min((stats?.totalProducts || 0) / 10 * 100, 100)} 
              color="bg-blue-500" 
            />
            <ProgressBar 
              label="เป้าหมายรายได้" 
              percentage={Math.min((stats?.totalRevenue || 0) / 100000 * 100, 100)} 
              color="bg-green-500" 
            />
            <ProgressBar 
              label="การเติบโตของลูกค้า" 
              percentage={75} 
              color="bg-purple-500" 
            />
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">อัปเดตล่าสุด</p>
              <p className="text-xs text-gray-500">{new Date().toLocaleString('th-TH')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">

        </p>
      </div>
    </div>
  );
}

// Components
function StatCard({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string; 
  value: string; 
  icon: string; 
  color: string 
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`${color} w-14 h-14 rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ 
  label, 
  percentage, 
  color 
}: { 
  label: string; 
  percentage: number; 
  color: string 
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-300`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}