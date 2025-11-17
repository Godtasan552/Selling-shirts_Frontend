'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, LogOut, Loader } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          router.push('/admin_login');
          setIsChecking(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin_login');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');

    setIsAuthenticated(false);
    setIsChecking(false);
    router.push('/admin_login');
  };

  if (!isMounted || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-600 to-blue-700 text-white transition-all duration-300 ease-in-out shadow-xl flex flex-col fixed left-0 top-0 h-screen z-40`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-blue-500/30">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="animate-fadeIn">
                <h1 className="text-2xl font-bold">Admin</h1>
                <p className="text-xs text-blue-100">Dashboard</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem
            href="/admin/dashboard"
            label="Dashboard"
            icon="📊"
            sidebarOpen={sidebarOpen}
            isActive={pathname === '/admin/dashboard'}
          />
          <NavItem
            href="/admin/users"
            label="Users"
            icon="👥"
            sidebarOpen={sidebarOpen}
            isActive={pathname === '/admin/users'}
          />
          <NavItem
            href="/admin/admin-users"
            label="Admin Users"
            icon="🔐"
            sidebarOpen={sidebarOpen}
            isActive={pathname === '/admin/admin-users'}
          />
          <NavItem
            href="/admin/products"
            label="Products"
            icon="📦"
            sidebarOpen={sidebarOpen}
            isActive={pathname === '/admin/products'}
          />
          <NavItem
            href="/admin/settings"
            label="Settings"
            icon="⚙️"
            sidebarOpen={sidebarOpen}
            isActive={pathname === '/admin/settings'}
          />
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-500/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-200 font-medium hover:shadow-lg transform hover:scale-105"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6 sticky top-0 z-10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {getPageTitle(pathname)}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  icon: string;
  sidebarOpen: boolean;
  isActive: boolean;
}

function NavItem({ href, label, icon, sidebarOpen, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-blue-500/40 text-white shadow-lg scale-105'
          : 'text-blue-100 hover:bg-blue-500/20 hover:text-white'
      }`}
    >
      <span className="text-xl">{icon}</span>
      {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
}

function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/admin/dashboard': '📊 Dashboard',
    '/admin/users': '👥 Users',
    '/admin/admin-users': '🔐 Admin Users',
    '/admin/products': '📦 Products',
    '/admin/settings': '⚙️ Settings',
  };
  return titles[pathname] || 'Admin Panel';
}