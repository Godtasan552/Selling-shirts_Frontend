'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SizeCard from '../components/SizeCard';
import ProductSummaryCards from '../components/ProductSummaryCards';

// ==================== Types ====================
interface ProductVariant {
  size: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  sizes: ProductVariant[];
}

interface HomeStats {
  success: boolean;
  stats: {
    products: Array<{
      productId: string;
      name: string;
      totalSold: number;
      imageUrl: string;
      variants: ProductVariant[];
    }>;
  };
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ==================== Constants ====================
const CONFIG = {
  SIZE_ORDER: ['SSS', 'SS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', '9XL', '10XL'] as const,
  API_ENDPOINT: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  CAROUSEL_INTERVAL: 6000,
  FALLBACK_IMAGE: '/shirt_mourning.jpg',
  PRODUCT_PRICE: '฿195',
} as const;

// ==================== Utilities ====================
const transformApiProduct = (api: HomeStats['stats']['products'][0]): Product => ({
  id: api.productId,
  name: api.name,
  description: `ขายไปแล้ว ${api.totalSold} ชิ้น`,
  price: CONFIG.PRODUCT_PRICE,
  imageUrl: api.imageUrl,
  sizes: api.variants,
});

const getImageUrl = (url?: string): string => url?.trim() || CONFIG.FALLBACK_IMAGE;

const createSizeData = (sizes: ProductVariant[]) =>
  CONFIG.SIZE_ORDER.map((size) => ({
    size,
    stock: sizes.find((s) => s.size.toUpperCase() === size)?.stock ?? 0,
  }));

// ==================== Sub Components ====================
const LoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin mb-4" />
    <p className="text-lg text-gray-500">กำลังโหลดข้อมูลสินค้า...</p>
  </div>
);

const ErrorAlert = ({ message }: { message: string }) => (
  <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
    <span>{message}</span>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12 text-gray-400">
    <p>ไม่มีสินค้าในการแนะนำ</p>
  </div>
);

const HeroSection = ({ onShopClick }: { onShopClick: () => void }) => (
  <div className="hero min-h-[50vh] bg-white rounded-xl shadow-md mb-12 overflow-hidden">
    <div className="hero-content text-center flex-col lg:flex-row-reverse p-6 sm:p-10">
      <div className="relative w-full lg:w-1/2">
        <Image
          src="/All.jpg"
          alt="Latest Collection"
          width={450}
          height={450}
          className="rounded-lg object-cover"
          priority
        />
      </div>

      <div className="lg:pr-10 mt-6 lg:mt-0">
        <h1 className="text-4xl font-semibold mb-4 text-gray-900">คอลเลกชันใหม่ล่าสุด!</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          พร้อมส่งตรงถึงบ้านคุณ เสื้อยืดคุณภาพเยี่ยม ดีไซน์ทันสมัย อย่าพลาด!
        </p>
        <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
          <Link
            href="/order"
            className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:opacity-80 transition"
          >
            🛒 ช้อปเลย!
          </Link>
          <button
            onClick={onShopClick}
            className="px-6 py-3 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-100 transition"
          >
            ดูรายละเอียด
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ==================== ProductCardSplit (Fixed) ====================
const ProductCardSplit = ({ product }: { product: Product }) => {
  const sizeData = createSizeData(product.sizes);
  const imageUrl = getImageUrl(product.imageUrl);

  return (
    <div className="flex bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden mb-6 min-h-[450px]">
      {/* ด้านซ้าย - รูปภาพ (40%) */}
      <div className="w-2/5 relative bg-gray-50 flex items-center justify-center flex-shrink-0">
        <Image
          src={imageUrl}
          alt={product.name}
          width={300}
          height={450}
          className="h-full w-full object-contain"
          onError={(e) => { e.currentTarget.src = CONFIG.FALLBACK_IMAGE; }}
        />
      </div>

      {/* ด้านขวา - ข้อมูลสินค้า (60%) */}
      <div className="w-3/5 p-6 sm:p-8 flex flex-col justify-between">
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{product.name}</h2>
          <p className="text-sm sm:text-base text-gray-500">{product.description}</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-3">ขนาดที่มี:</p>
            <SizeCard productType="colored" sizes={sizeData} />
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">ราคา</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{product.price}</p>
          </div>
          <div className="flex gap-2 w-full">
            <Link
              href={`/order?product=${product.id}`}
              className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg text-center font-medium text-sm hover:opacity-80 transition"
            >
              🛒 สั่งซื้อ
            </Link>
            <button className="flex-1 px-4 py-3 border border-gray-900 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
              👁️ ดู
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== ProductCarousel (Fixed) ====================
const ProductCarousel = ({ products }: { products: Product[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const displayProducts = products.slice(0, 3);
  const total = displayProducts.length;

  useEffect(() => {
    if (total === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, CONFIG.CAROUSEL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [total]);

  if (!total) return <EmptyState />;

  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + total) % total);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % total);

  return (
    <div className="w-full p-6 rounded-xl mb-12 bg-white border border-gray-200 shadow-md">
      <h2 className="text-3xl lg:text-4xl font-semibold text-center text-gray-900 mb-12">
        ✨ สินค้าแนะนำประจำสัปดาห์
      </h2>

      <div className="relative flex items-center justify-center">
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="absolute left-0 z-10 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition"
        >
          ◀
        </button>

        {/* Carousel Container */}
        <div className="w-full px-12 overflow-hidden">
          <div className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {displayProducts.map((product) => (
              <div key={product.id} className="w-full flex-shrink-0">
                <ProductCardSplit product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-0 z-10 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition"
        >
          ▶
        </button>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {displayProducts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition ${idx === currentIndex ? 'bg-gray-900' : 'bg-gray-300'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

// ==================== Contact CTA ====================
const ContactCTA = ({ onLineClick, onMessengerClick }: { onLineClick: () => void; onMessengerClick: () => void }) => (
  <div className="py-8 px-6 bg-gray-900 text-white rounded-xl text-center shadow-md mb-8">
    <h3 className="text-2xl font-semibold mb-3">🎁 ไม่พบสินค้าที่ชอบ?</h3>
    <p className="mb-4 text-gray-200">ติดต่อเราผ่าน LINE หรือ Facebook ได้เลย!</p>
    <div className="flex gap-4 justify-center flex-wrap">
      <button onClick={onLineClick} className="px-6 py-2 bg-white text-gray-900 rounded-lg font-medium hover:opacity-80 transition">
        📱 Chat LINE
      </button>
      <button onClick={onMessengerClick} className="px-6 py-2 bg-white text-gray-900 rounded-lg font-medium hover:opacity-80 transition">
        👥 Messenger
      </button>
    </div>
  </div>
);

// ==================== Main Component ====================
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [state, setState] = useState<LoadingState>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setState('loading');
        const res = await fetch(`${CONFIG.API_ENDPOINT}/api/public/home-stats`);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const data: HomeStats = await res.json();
        if (!data.success) throw new Error('ดึงข้อมูลสินค้าไม่สำเร็จ');
        setProducts(data.stats.products.map(transformApiProduct));
        setState('success');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'เชื่อมต่อ API ไม่ได้';
        setError(message);
        setState('error');
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow p-4 sm:px-6 lg:px-8 container mx-auto max-w-7xl">
        <HeroSection onShopClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} />

        {state === 'loading' && <LoadingSkeleton />}
        {state === 'error' && <ErrorAlert message={error} />}
        {state === 'success' && <ProductCarousel products={products} />}

        <div className="text-center mt-16 mb-12">
          <Link href="/order" className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg shadow hover:opacity-80 transition">
            🛍️ ดูสินค้าทั้งหมด & สั่งซื้อ
          </Link>
          <p className="text-gray-500 mt-4 text-sm">ส่งฟรีทั่วประเทศ | รับประกันคุณภาพ</p>
        </div>

        <ProductSummaryCards />


        <ContactCTA
          onLineClick={() => window.open('https://line.me/', '_blank')}
          onMessengerClick={() => window.open('https://www.messenger.com', '_blank')}
        />
      </main>
      <Footer />
    </div>
  );
}