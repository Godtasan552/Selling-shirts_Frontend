"use client";

import { useState } from "react";
import { ShoppingCart, AlertCircle } from "lucide-react";

export default function OrderProductCard({ product, onAdd }: any) {
  const [selectedSku, setSelectedSku] = useState("");
  const [qty, setQty] = useState(1);

  return (
    <div className="p-4 border rounded-xl 
  bg-white dark:bg-gray-800 
  shadow-md animate__animated animate__fadeInUp
  text-black dark:text-white">
      <img
        src={product.imageUrl || "/no-image.png"}
        className="w-full h-48 object-cover object-center rounded-lg"
      />

      <h2 className="font-bold text-lg mt-2">{product.name}</h2>
      <p className="text-gray-600 dark:text-gray-300 text-sm">ขายแล้ว: {product.totalSold}</p>

      {/* Sizes */}
      <div className="flex gap-2 mt-3">
        {product.variants.map((v: any) => (
          <button
            key={v.sku}
            onClick={() => setSelectedSku(v.sku)}
            className={`px-3 py-1 border rounded-full text-sm ${
              selectedSku === v.sku
                        ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}
          >
            {v.size}เหลือ{v.stock} {v.price} ฿
          </button>
        ))}
      </div>

      {/* Qty */}
      <div className="mt-3 flex gap-2 items-center">
        <label className="text-sm text-gray-700 dark:text-gray-300">จำนวน:</label>
        <input
          type="number"
          min={1}
          className="w-20 p-1 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />
      </div>

      {/* Add button */}
      <button
        disabled={!selectedSku}
        onClick={() =>{
          const selectedVariant = product.variants.find((v: any) => v.sku === selectedSku);
          if(!selectedVariant){
            return alert("ไม่พบตัวเลือกสินค้า กรุณาเลือกขนาดอีกครั้ง");
          }
          onAdd({
            productId: product.productId,
            sku: selectedVariant.sku,
            size: selectedVariant.size,
            price: Number(selectedVariant.price),
            quantity: Number(qty) || 1,
            name: product.name,
          });
        }}
          className={`
      mt-4 w-full flex items-center justify-center gap-2 
      px-3 py-2 rounded-lg transition
      ${selectedSku 
        ? "bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200" 
        : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600"}
    `}
  >
        <ShoppingCart size={18} />
        เพิ่มลงตะกร้า
      </button>

      {!selectedSku && (
        <p className="mt-1 flex items-center gap-1 text-red-500 text-sm">
          <AlertCircle size={14} /> กรุณาเลือก Size ก่อน
        </p>
      )}
    </div>
  );
}
