// src/components/ProductSummaryCards.tsx
import React from 'react';

const ProductSummaryCards: React.FC = () => {
  // TODO: เชื่อมต่อกับ Backend เพื่อดึงข้อมูลจำนวนเสื้อทั้งหมดและจำนวนที่ขายไปแล้ว
  const totalShirtsAvailable = 0; // Placeholder
  const totalShirtsSold = 0;     // Placeholder

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mb-8">
      {/* Card for Total Shirts Available */}
      <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-primary/20 transition-all duration-300">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl font-bold text-primary">จำนวนเสื้อทั้งหมด</h2>
          <p className="text-5xl font-extrabold text-secondary mt-4">{totalShirtsAvailable}</p>
          <p className="text-lg text-base-content/70">ตัว</p>
        </div>
      </div>

      {/* Card for Total Shirts Sold */}
      <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-accent/20 transition-all duration-300">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl font-bold text-primary">จำนวนเสื้อที่ขายไปแล้ว</h2>
          <p className="text-5xl font-extrabold text-accent mt-4">{totalShirtsSold}</p>
          <p className="text-lg text-base-content/70">ตัว</p>
        </div>
      </div>
    </div>
  );
};

export default ProductSummaryCards;
