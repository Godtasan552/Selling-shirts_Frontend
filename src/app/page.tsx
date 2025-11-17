import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">ร้านขายเสื้อ</h1>
            <p className="text-lg mb-8 text-gray-600">ยินดีต้อนรับสู่ร้านขายเสื้อออนไลน์ของเรา</p>
            {/* เชื่อม หน้าสั่งซื้อสินค้า ตรงนี้ */}
            <Link href="/order" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                ไปหน้าสั่งซื้อสินค้า
              </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}