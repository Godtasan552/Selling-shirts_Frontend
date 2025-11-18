// src/components/ProductSummaryCards.tsx
'use client';
import React from 'react';
import { usePublicStats } from '../hooks/usePublicStats';

const ProductSummaryCards: React.FC = () => {
  const { stats, loading, error } = usePublicStats();

  const StatCard: React.FC<{ title: string; value: number | string; loading: boolean; colorClass: string }> = ({ title, value, loading, colorClass }) => (
    <div className={`card bg-base-100 shadow-xl border border-base-300 hover:shadow-${colorClass}/20 transition-all duration-300`}>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-3xl font-bold text-primary">{title}</h2>
        {loading ? (
          <span className="loading loading-dots loading-lg text-secondary mt-4"></span>
        ) : (
          <p className={`text-5xl font-extrabold ${colorClass} mt-4`}>{value}</p>
        )}
        <p className="text-lg text-base-content/70">ตัว</p>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="alert alert-error shadow-lg mt-12 mb-8">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>ไม่สามารถโหลดข้อมูลสรุปได้: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mb-8">
      <StatCard 
        title="จำนวนเสื้อทั้งหมด" 
        value={stats?.totalStock ?? 0} 
        loading={loading}
        colorClass="text-secondary"
      />
      <StatCard 
        title="จำนวนเสื้อที่ขายไปแล้ว" 
        value={stats?.totalSold ?? 0} 
        loading={loading}
        colorClass="text-accent"
      />
    </div>
  );
};

export default ProductSummaryCards;
