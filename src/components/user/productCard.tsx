"use client";
import { useState } from "react";
import { ShoppingCart, AlertCircle } from "lucide-react";

// ✅ Define type for product variant
interface ProductVariant {
  sku: string;
  size: string;
  stock: number;
  price: number | string;
}

// ✅ Define type for product
interface Product {
  productId: string;
  name: string;
  imageUrl?: string;
  totalSold: number;
  variants: ProductVariant[];
}

// ✅ Define type for cart item that will be passed to onAdd
interface CartItem {
  productId: string;
  sku: string;
  size: string;
  price: number;
  quantity: number;
  name: string;
}

// ✅ Define component props
interface OrderProductCardProps {
  product: Product;
  onAdd: (item: CartItem) => void;
}

export default function OrderProductCard({ product, onAdd }: OrderProductCardProps) {
  const [selectedSku, setSelectedSku] = useState<string>("");
  const [qty, setQty] = useState<number>(1);

  return (
    <div className="p-5 rounded-2xl bg-white/60 backdrop-blur border border-white/50 shadow-md hover:shadow-lg transition-all">
      <div className="w-full aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl overflow-hidden mb-4">
        <img
          src={product.imageUrl || "/no-image.png"}
          className="w-full h-full object-cover"
          alt={product.name}
        />
      </div>

      <h2 className="font-light text-lg text-gray-700 mb-1">{product.name}</h2>
      <p className="text-xs text-gray-400 font-light">ขายแล้ว: {product.totalSold} ชิ้น</p>

      {/* Sizes */}
      <div className="flex flex-wrap gap-2 mt-4 mb-4">
        {product.variants.map((v: ProductVariant) => (
          <button
            key={v.sku}
            onClick={() => setSelectedSku(v.sku)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedSku === v.sku
                ? "bg-gradient-to-r from-pink-300 to-rose-300 text-white shadow-md"
                : "bg-pink-50 text-gray-600 border border-pink-100 hover:bg-pink-100"
            }`}
          >
            <span className="font-semibold">{v.size}</span>
            <span className="text-gray-500 ml-1">เหลือ{v.stock}</span>
            <span className="ml-1">{v.price} ฿</span>
          </button>
        ))}
      </div>

      {/* Qty */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-pink-50/50 border border-pink-100/50">
        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">จำนวน:</label>
        <input
          type="number"
          min={1}
          className="w-16 px-2 py-1.5 rounded-lg border border-pink-200 bg-white text-gray-700 text-sm font-light focus:outline-none focus:ring-2 focus:ring-pink-200"
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
        />
      </div>

      {/* Add button */}
      <button
        disabled={!selectedSku}
        onClick={() => {
          const selectedVariant = product.variants.find((v: ProductVariant) => v.sku === selectedSku);
          if (!selectedVariant) {
            return alert("ไม่พบตัวเลือกสินค้า กรุณาเลือกขนาดอีกครั้ง");
          }
          onAdd({
            productId: product.productId,
            sku: selectedVariant.sku,
            size: selectedVariant.size,
            price: Number(selectedVariant.price),
            quantity: qty,
            name: product.name,
          });
          setSelectedSku("");
          setQty(1);
        }}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-light text-sm transition-all ${
          selectedSku
            ? "bg-gradient-to-r from-pink-300 to-rose-300 text-white hover:shadow-lg active:scale-95"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        <ShoppingCart size={16} />
        เพิ่มลงตะกร้า
      </button>

      {!selectedSku && (
        <p className="mt-2 flex items-center gap-1 text-red-400 text-xs font-light">
          <AlertCircle size={12} /> เลือกขนาดก่อน
        </p>
      )}
    </div>
  );
}