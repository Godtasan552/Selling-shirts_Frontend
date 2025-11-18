'use client';

import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import SizeCard from '../components/SizeCard';
import ProductSummaryCards from '../components/ProductSummaryCards';

// ประกาศ Types
interface ProductVariant {
  size: string;
  stock: number;
}

interface ApiProduct {
  productId: string;
  name: string;
  totalSold: number;
  imageUrl: string;
  variants: ProductVariant[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  type: string;
  sizes: ProductVariant[];
}

interface HomeStats {
  success: boolean;
  stats: {
    products: ApiProduct[];
  };
}

interface SizeInfo {
  size: string;
  stock: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const carouselRef = useRef<HTMLDivElement>(null);

  // ไซส์ทั้งหมดเรียงตามลำดับ
  const allSizes: string[] = ["SSS", "SS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL", "9XL", "10XL"];
  
  // โหลดข้อมูลจาก API
  useEffect(() => {
    const fetchStats = async (): Promise<void> => {
      try {
        const res = await fetch("http://localhost:5000/api/public/home-stats");
        if (!res.ok) throw new Error('API Error');
        
        const data: HomeStats = await res.json();

        if (!data.success) {
          setError("โหลดข้อมูลไม่สำเร็จ");
          return;
        }

        const apiProducts: Product[] = data.stats.products.map((p: ApiProduct) => ({
          id: p.productId,
          name: p.name,
          description: `ขายไปแล้ว ${p.totalSold} ชิ้น`,
          price: "฿195",
          imageUrl: p.imageUrl,
          type: "colored",
          sizes: p.variants
        }));

        setProducts(apiProducts);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "เชื่อมต่อ API ไม่ได้";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Auto-carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const slideWidth = clientWidth;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5;

        if (isAtEnd) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: slideWidth, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ปุ่มเลื่อน
  const scrollPrev = (): void => {
    if (carouselRef.current) {
      const width = carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({ left: -width, behavior: 'smooth' });
    }
  };

  const scrollNext = (): void => {
    if (carouselRef.current) {
      const width = carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({ left: width, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" data-theme="light">
      <Navbar />

      <main className="flex-grow p-4 sm:px-6 lg:px-8 container mx-auto max-w-7xl">

        {/* HERO SECTION */}
        <div className="hero min-h-[50vh] bg-gradient-to-r from-primary to-secondary rounded-3xl shadow-2xl mb-12 border-2 border-primary/20 overflow-hidden animate-fade-in">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 right-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="hero-content text-center flex-col lg:flex-row-reverse p-6 sm:p-10 relative z-10">
            <div className="relative w-full lg:w-1/2 lg:pl-8">
              <Image
                src="/shirt_mourning.jpg"
                alt="Latest Collection"
                width={450}
                height={450}
                className="rounded-2xl shadow-2xl object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -top-5 -right-5 badge badge-lg badge-accent font-bold text-white animate-bounce">
                🔥 NEW!
              </div>
            </div>
            
            <div className='lg:pr-10 text-white'>
              <h1 className="text-5xl lg:text-7xl font-black mb-6 drop-shadow-lg animate-fade-in-down">
                คอลเลกชันใหม่ล่าสุด!
              </h1>
              <p className="py-6 text-lg lg:text-xl drop-shadow-md leading-relaxed font-medium">
                พร้อมส่งตรงถึงบ้านคุณ เสื้อยืดคุณภาพเยี่ยม ดีไซน์ทันสมัย อย่าพลาด!
              </p>
              <div className="flex gap-4 flex-col sm:flex-row justify-center lg:justify-start mt-8">
                <Link 
                  href="/order" 
                  className="btn btn-accent btn-lg shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 font-bold text-lg"
                >
                  🛒 ช้อปเลย!
                </Link>
                <button className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary shadow-xl hover:scale-110 transition-all duration-300 font-bold">
                  ดูรายละเอียด
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT SLIDER */}
        <div className="w-full p-6 rounded-2xl mb-12 bg-white/50 backdrop-blur-sm border border-white/80 shadow-lg">

          <h2 className="text-4xl lg:text-5xl font-black text-center bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-12 animate-fade-in">
            ✨ สินค้าแนะนำประจำสัปดาห์
          </h2>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
              <p className="text-lg text-base-content/70">กำลังโหลดข้อมูลสินค้า...</p>
            </div>
          )}
          
          {error && (
            <div className="alert alert-error shadow-lg mb-6 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l4-8m4 8l-4-8m4 8H6m8 0H6" /></svg>
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-base-content/60">ไม่มีสินค้าในการแนะนำ</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="relative w-full">

              {/* ปุ่มซ้าย */}
              <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 btn btn-circle btn-secondary shadow-xl z-20 hover:scale-110 transition-transform duration-300 hidden sm:flex"
              >
                ❮
              </button>

              {/* ปุ่มขวา */}
              <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 btn btn-circle btn-secondary shadow-xl z-20 hover:scale-110 transition-transform duration-300 hidden sm:flex"
              >
                ❯
              </button>

              {/* CAROUSEL */}
              <div
                ref={carouselRef}
                className="carousel w-full rounded-2xl shadow-2xl border-2 border-primary/10 overflow-x-scroll snap-x snap-mandatory px-4 sm:px-12"
              >
                {/* In your HomePage component, replace the Image component section */}

                {products.map((product: Product, idx: number) => {
                  const sizeData: SizeInfo[] = allSizes.map((size: string) => {
                    const found = product.sizes.find((s: ProductVariant) => s.size.toUpperCase() === size);
                    return { size, stock: found ? found.stock : 0 };
                  });

                  // Add null check for imageUrl with fallback
                  const imageUrl = product.imageUrl && product.imageUrl.trim() !== '' 
                    ? product.imageUrl.trim()
                    : '/shirt_mourning.jpg'; // Fallback image

                  return (
                    <div 
                      key={product.id} 
                      className="carousel-item relative w-full justify-center p-4 snap-center min-w-full animate-fade-in"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="card w-full lg:card-side bg-gradient-to-br from-white to-blue-50 shadow-2xl hover:shadow-primary/30 transition-all duration-500 ease-in-out transform hover:scale-[1.02] border border-primary/10">
                        <figure className="lg:w-1/2 p-4 sm:p-8 bg-gradient-to-b from-slate-100 to-slate-50 flex items-center justify-center rounded-2xl lg:rounded-none lg:rounded-l-2xl">
                          <div className="w-full h-96 relative overflow-hidden rounded-xl">
                            <Image
                              src={imageUrl}
                              alt={product.name}
                              fill
                              className="rounded-xl object-cover hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 1024px) 90vw, 40vw"
                              onError={(e) => {
                                e.currentTarget.src = '/shirt_mourning.jpg'; // Fallback on error
                              }}
                            />
                          </div>
                        </figure>

                        <div className="card-body lg:w-1/2 justify-center text-center lg:text-left p-8">
                          <div className="flex justify-center lg:justify-start gap-2 mb-3">
                            <span className="badge badge-lg badge-secondary font-bold text-white animate-pulse">🔥 HOT!</span>
                            <span className="badge badge-lg badge-primary font-bold text-white">⭐ NEW</span>
                          </div>
                          
                          <h2 className="card-title text-3xl lg:text-4xl font-black text-primary mb-3 line-clamp-2">{product.name}</h2>
                          <p className="text-base lg:text-lg text-base-content/70 font-semibold">{product.description}</p>

                          {/* SizeCard */}
                          <div className="my-6 p-4 bg-base-200 rounded-xl">
                            <SizeCard
                              productType="colored"
                              sizes={sizeData}
                            />
                          </div>

                          <div className="divider my-2"></div>

                          <div className="flex justify-between items-center w-full mt-6 flex-col lg:flex-row gap-4">
                            <p className="text-5xl font-black text-secondary drop-shadow-lg">{product.price}</p>
                            <div className="flex gap-3 w-full lg:w-auto">
                              <button className="btn btn-primary btn-lg flex-1 lg:flex-none hover:scale-105 transition-all duration-300 font-bold shadow-lg">
                                🛒 สั่งซื้อ
                              </button>
                              <button className="btn btn-outline btn-lg flex-1 lg:flex-none hover:scale-105 transition-all duration-300 font-bold">
                                👁️ ดู
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 mb-12">
          <Link 
            href="/order" 
            className="btn btn-primary btn-wide btn-lg shadow-2xl font-bold text-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-300 animate-bounce"
          >
            🛍️ ดูสินค้าทั้งหมด & สั่งซื้อ
          </Link>
          <p className="text-base-content/60 mt-4 text-sm">ส่งฟรีทั่วประเทศ | รับประกันคุณภาพ</p>
        </div>

        <ProductSummaryCards />

        {/* Full-width Image Card */}
        <div className="w-full mt-12 mb-12 rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/10 hover:shadow-primary/30 transition-all duration-500 transform hover:scale-[1.01] animate-fade-in">
          <Image
            src="/All.jpg"
            alt="All Products"
            width={1920}
            height={1080}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* Footer CTA */}
        <div className="py-8 px-6 bg-gradient-to-r from-primary to-secondary rounded-2xl text-white text-center shadow-2xl mb-8 animate-fade-in">
          <h3 className="text-3xl font-black mb-3">🎁 ไม่พบสินค้าที่ชอบ?</h3>
          <p className="mb-4 text-lg font-medium">ติดต่อเราผ่าน LINE หรือ Facebook ได้เลย!</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="btn btn-accent font-bold shadow-lg hover:scale-110 transition-transform">
              📱 Chat LINE
            </button>
            <button className="btn btn-accent font-bold shadow-lg hover:scale-110 transition-transform">
              👥 Messenger
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
