// src/components/SizeCard.tsx
import React from 'react';

interface Size {
  size: string;
  stock: number;
}

interface SizeCardProps {
  productType: 'colored' | 'mourning';
  sizes: Size[];
}

const SizeCard: React.FC<SizeCardProps> = ({ productType, sizes }) => {
  const title = productType === 'colored' ? 'ไซส์เสื้อสีสันสดใส' : 'ไซส์เสื้อสำหรับไว้อาลัย';

  // Sort sizes based on a predefined order
  const sizeOrder = ['SS', 'SSS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '8XL'];
  const sortedSizes = [...sizes].sort((a, b) => {
    return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size);
  });

  return (
    <div className="card bg-base-200 shadow-md p-4 mt-4">
      <h3 className="text-xl font-bold mb-3 text-center">{title}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {sortedSizes.map((s) => (
          <div key={s.size} className="flex flex-col items-center justify-center bg-base-100 rounded-lg p-2 shadow-sm">
            <span className="font-semibold text-lg">{s.size}</span>
            {/* TODO: เชื่อมต่อกับ Backend เพื่อดึงข้อมูลจำนวนสต็อกจริง */}
            <span className="text-sm text-gray-500">คงเหลือ: {s.stock}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SizeCard;
