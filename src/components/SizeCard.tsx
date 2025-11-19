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

  const row1 = ["SSS", "SS", "S", "M", "L"];
  const row2 = ["XL", "2XL", "3XL", "4XL", "5XL"];
  const row3 = ["6XL", "7XL", "8XL", "9XL", "10XL"];

  // Pastel color mapping
  const pastelColors = {
    colored: {
      bg: 'bg-pink-50',
      card: 'bg-gradient-to-br from-pink-100 to-rose-100',
      title: 'text-pink-700',
      border: 'border border-pink-200',
      stock: 'text-pink-600',
      outOfStock: 'text-rose-400'
    },
    mourning: {
      bg: 'bg-blue-50',
      card: 'bg-gradient-to-br from-blue-100 to-cyan-100',
      title: 'text-blue-700',
      border: 'border border-blue-200',
      stock: 'text-blue-600',
      outOfStock: 'text-blue-400'
    }
  };

  const colors = pastelColors[productType];

  const renderSize = (sizeName: string) => {
    const sizeData = sizes.find(s => s.size === sizeName);
    const stock = sizeData ? sizeData.stock : 0;
    
    return (
      <div 
        key={sizeName} 
        className={`flex flex-col items-center justify-center ${colors.card} ${colors.border} rounded-lg p-3 shadow-sm text-center transition-all hover:shadow-md hover:scale-105`}
      >
        <span className={`font-semibold text-md ${colors.title}`}>{sizeName}</span>
        <span className={`text-sm font-medium ${stock > 0 ? colors.stock : colors.outOfStock}`}>
          {stock > 0 ? `คงเหลือ: ${stock}` : 'หมด'}
        </span>
      </div>
    );
  };

  return (
    <div className={`${colors.bg} ${colors.border} rounded-xl p-6 mt-4 shadow-lg transition-all`}>
      <h3 className={`text-xl font-bold mb-4 text-center ${colors.title}`}>{title}</h3>
      <div className="flex flex-col gap-4">
        {/* Row 1 */}
        <div className="grid grid-cols-5 gap-2">
          {row1.map(renderSize)}
        </div>
        {/* Row 2 */}
        <div className="grid grid-cols-5 gap-2">
          {row2.map(renderSize)}
        </div>
        {/* Row 3 */}
        <div className="grid grid-cols-5 gap-2">
          {row3.map(renderSize)}
        </div>
      </div>
    </div>
  );
};

export default SizeCard;