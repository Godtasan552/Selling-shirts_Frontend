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

  const renderSize = (sizeName: string) => {
    const sizeData = sizes.find(s => s.size === sizeName);
    const stock = sizeData ? sizeData.stock : 0;
    return (
      <div key={sizeName} className="flex flex-col items-center justify-center bg-base-100 rounded-lg p-2 shadow-sm text-center">
        <span className="font-semibold text-md">{sizeName}</span>
        <span className={`text-sm ${stock > 0 ? 'text-gray-500' : 'text-red-500'}`}>
          {stock > 0 ? `คงเหลือ: ${stock}` : 'หมด'}
        </span>
      </div>
    );
  };

  return (
    <div className="card bg-base-200 shadow-md p-4 mt-4">
      <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
      <div className="flex flex-col gap-3">
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
