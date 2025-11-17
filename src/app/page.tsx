'use client';

import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  // Placeholder product data
  const products = [
    {
      id: 1,
      name: 'เสื้อสีสันสดใส',
      description: 'เสื้อยืดคอตตอน 100% สีสันสดใส สวมใส่สบาย ระบายอากาศได้ดี เหมาะสำหรับทุกวัน',
      price: '฿195',
      imageUrl: '/shirt_color.jpg',
    },
    {
      id: 2,
      name: 'เสื้อสำหรับไว้อาลัย',
      description: 'เสื้อโปโลสีดำสุภาพ เนื้อผ้าดีเยี่ยม สำหรับสวมใส่ในโอกาสแสดงความอาลัยอย่างเป็นทางการ',
      price: '฿195', // ปรับราคาให้ต่างกันเล็กน้อยเพื่อความสมจริง
      imageUrl: '/shirt_mourning.jpg',
    },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ปรับปรุง logic สำหรับการหมุน carousel อัตโนมัติ: เลื่อนไปทีละ 100% ของความกว้าง element
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        
        // คำนวณความกว้างของแต่ละ slide (เนื่องจากใช้ w-full ใน carousel-item)
        const slideWidth = clientWidth; 
        
        // คำนวณตำแหน่งที่จะเลื่อนไป
        const nextScrollPosition = scrollLeft + slideWidth;

        // ตรวจสอบว่าถึง slide สุดท้ายแล้วหรือไม่
        // ใช้ค่าความคลาดเคลื่อนเล็กน้อย (e.g., 5px) ในการเปรียบเทียบ
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5; 

        if (isAtEnd) {
          // ถ้าถึง slide สุดท้าย, เลื่อนกลับไป slide แรก
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // ถ้ายังไม่ถึง slide สุดท้าย, เลื่อนไป slide ถัดไป
          carouselRef.current.scrollBy({ left: slideWidth, behavior: 'smooth' });
        }
      }
    }, 4000); 

    return () => clearInterval(interval); // Cleanup interval
  }, []);

  return (
    // ปรับใช้ธีมที่เน้นสีสันและมิติ (เช่น: เพิ่มสีพื้นหลังที่ดู premium และ shadow)
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-base-200 to-base-300" data-theme="light">
      <Navbar />
      <main className="flex-grow p-4 sm:px-6 lg:px-8 container mx-auto max-w-7xl">

        {/* 🌟 Hero Section: ส่วนต้อนรับและกระตุ้นความสนใจ */}
        <div className="hero min-h-[50vh] bg-base-100 rounded-2xl shadow-xl mb-12 border border-base-300 overflow-hidden">
            <div className="hero-content text-center flex-col lg:flex-row-reverse p-10">
                <Image
                    src="/shirt_mourning.jpg" // *เปลี่ยนเป็นรูปภาพสินค้าที่น่าสนใจที่สุด*
                    alt="Latest Collection"
                    width={450}
                    height={450}
                    className="rounded-xl shadow-2xl object-cover"
                />
                <div className='lg:pr-10'>
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-primary mb-4">
                        คอลเลกชันใหม่ล่าสุด!
                    </h1>
                    <p className="py-6 text-xl text-base-content/90">
                        พร้อมส่งตรงถึงบ้านคุณ เสื้อยืดคุณภาพเยี่ยม ดีไซน์ทันสมัย 
                        **อย่าพลาด**โอกาสเป็นเจ้าของ!
                    </p>
                    <Link href="/shop" className="btn btn-secondary btn-lg shadow-xl hover:scale-105 transition duration-300">
                        ช้อปเลย! 🚀
                    </Link>
                </div>
            </div>
        </div>
        
        {/* --- */}

        {/* 🛍️ Product Slider Section: สินค้าแนะนำ */}
        <div className="w-full p-4 rounded-xl mb-8">
          <h2 className="text-4xl font-bold text-center text-primary-focus mb-10 border-b-4 border-secondary pb-3 inline-block mx-auto animate-fade-in-down">
            ✨ สินค้าแนะนำประจำสัปดาห์
          </h2>
          <div ref={carouselRef} className="carousel w-full rounded-box shadow-2xl border border-base-300 overflow-x-scroll snap-x snap-mandatory">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                id={`slide${index + 1}`} 
                // เพิ่ม snap-center และ min-w-full เพื่อให้ carousel ทำงานถูกต้อง
                className="carousel-item relative w-full justify-center p-4 snap-center min-w-full"
              >
                <div className="card w-full lg:card-side bg-base-100 shadow-2xl hover:shadow-secondary/30 transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
                  <figure className="lg:w-1/2 p-4 sm:p-6 bg-base-200 flex items-center justify-center">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={450}
                      height={450}
                      className="rounded-xl object-cover w-full h-full max-h-96 lg:max-h-full" // ปรับ object-cover เพื่อให้ดูเต็ม
                    />
                  </figure>
                  <div className="card-body lg:w-1/2 justify-center text-center lg:text-left p-8">
                    <span className="badge badge-lg badge-secondary font-semibold mb-2">HOT!</span>
                    <h2 className="card-title text-4xl font-extrabold text-primary-focus">{product.name}</h2>
                    <p className="py-4 text-lg text-base-content/80">{product.description}</p>
                    <div className="flex justify-between items-center w-full mt-4 flex-col lg:flex-row gap-4">
                        <p className="text-4xl font-extrabold text-secondary">
                            {product.price}
                        </p>
                        <button className="btn btn-primary btn-outline btn-lg w-full lg:w-auto hover:scale-105 transition duration-300">
                            ดูรายละเอียด
                        </button>
                    </div>
                  </div>
                </div>
                {/* ปุ่มควบคุม Carousel */}
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                  <a href={`#slide${index === 0 ? products.length : index}`} className="btn btn-circle btn-secondary shadow-lg opacity-75 hover:opacity-100 transition">❮</a>
                  <a href={`#slide${index === products.length - 1 ? 1 : index + 2}`} className="btn btn-circle btn-secondary shadow-lg opacity-75 hover:opacity-100 transition">❯</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- */}

        {/* 🛒 Call to Action Button: ไปหน้าสั่งซื้อสินค้า */}
        <div className="text-center mt-12 mb-12">
          <Link href="/order" 
            className="btn btn-primary btn-wide btn-lg shadow-2xl animate-pulse hover:animate-none hover:bg-primary-focus transition duration-500">
            ดูสินค้าทั้งหมด & สั่งซื้อ 🛍️
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}