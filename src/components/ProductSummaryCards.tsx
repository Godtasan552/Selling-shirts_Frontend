// src/components/ProductSummaryCards.tsx
'use client';
import React from 'react';
import { usePublicStats } from '../hooks/usePublicStats';

// ✅ Move StatCard OUTSIDE the component
interface StatCardProps {
  title: string;
  value: number | string;
  loading: boolean;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, loading, colorClass }) => (
  <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-100/50 to-purple-100/50 border border-white/50 shadow-md hover:shadow-lg transition-all">
    <h2 className="font-light text-lg text-gray-700 mb-3">{title}</h2>
    {loading ? (
      <div className="flex justify-center py-4">
        <div className="animate-spin">
          <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-400 rounded-full"></div>
        </div>
      </div>
    ) : (
      <p className={`text-4xl font-light ${colorClass}`}>{value}</p>
    )}
    <p className="text-xs text-gray-400 font-light mt-2">ชิ้น</p>
  </div>
);

const ProductSummaryCards: React.FC = () => {
  const { stats, loading, error } = usePublicStats();

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-100/50 border border-red-200 text-red-600 text-sm font-light mt-8 mb-8">
        ไม่สามารถโหลดข้อมูลสรุปได้: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
      <StatCard
        title="จำนวนเสื้อทั้งหมด"
        value={stats?.totalStock ?? 0}
        loading={loading}
        colorClass="text-pink-600"
      />
      <StatCard
        title="จำนวนเสื้อที่ขายไปแล้ว"
        value={stats?.totalSold ?? 0}
        loading={loading}
        colorClass="text-rose-600"
      />
    </div>
  );
};

export default ProductSummaryCards;