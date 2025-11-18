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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (!mobile && !isMounted) {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isMounted]);

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

  const handleNavClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay สำหรับ Mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 ease-in-out"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-40
          bg-gradient-to-b from-blue-600 to-blue-700 text-white 
          shadow-2xl flex flex-col
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:w-20 lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-4 border-b border-blue-500/30 transition-all duration-300">
          <div className="flex items-center justify-between gap-2">
            <div 
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
              `}
            >
              <div className="whitespace-nowrap">
                <h1 className="text-2xl font-bold">Admin</h1>
                <p className="text-xs text-blue-100">Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="
                p-2 hover:bg-blue-500/20 rounded-lg 
                transition-all duration-200 ease-in-out
                hover:scale-110 active:scale-95
                flex-shrink-0
              "
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 transition-transform duration-300 rotate-0" />
              ) : (
                <Menu className="w-5 h-5 transition-transform duration-300 rotate-0" />
              )}
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
            onClick={handleNavClick}
          />
          <NavItem
            href="/admin/users"
            label="Users"
            icon="👥"
            sidebarOpen={sidebarOpen}
            isActive={pathname === '/admin/users'}
            onClick={handleNavClick}
          />
          <NavItem
            href="/admin/admin-users"
            label="Admin Users"
            icon="🔐"
            sidebarOpen={sidebarOpen}
            isActive={pathname === '/admin/admin-users'}
            onClick={handleNavClick}
          />
          <NavItem
            href="/admin/products"
            label="Products"
            icon="📦"
            sidebarOpen={sidebarOpen}
            isActive={pathname === '/admin/products'}
            onClick={handleNavClick}
          />
          <NavItem
            href="/admin/settings"
            label="Settings"
            icon="⚙️"
            sidebarOpen={sidebarOpen}
            isActive={pathname === '/admin/settings'}
            onClick={handleNavClick}
          />
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-500/30">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center justify-center gap-2 px-4 py-3
              bg-gradient-to-r from-red-500 to-red-600
              hover:from-red-600 hover:to-red-700
              rounded-lg transition-all duration-300 ease-in-out
              font-medium hover:shadow-lg
              transform hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-blue-700
            "
          >
            <LogOut className="w-5 h-5 transition-transform duration-300" />
            <span 
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
              `}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6 sticky top-0 z-10 flex items-center gap-4 transition-all duration-300">
          {!sidebarOpen && isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="
                p-2 hover:bg-gray-100 rounded-lg 
                transition-all duration-200 ease-in-out
                hover:scale-110 active:scale-95
                animate-pulse lg:animate-none
              "
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          )}
          
          <h2 className="
            text-2xl lg:text-3xl font-bold 
            bg-gradient-to-r from-blue-600 to-indigo-600 
            bg-clip-text text-transparent
            transition-all duration-300
          ">
            {getPageTitle(pathname)}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-6 transition-all duration-300">
          {children}
        </div>
      </main>

      <style>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutLeft {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideInLeft 0.3s ease-out forwards;
        }

        .animate-slideOut {
          animation: slideOutLeft 0.3s ease-in forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
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
  onClick?: () => void;
}

function NavItem({ href, label, icon, sidebarOpen, isActive, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg 
        transition-all duration-300 ease-in-out
        group cursor-pointer
        ${
          isActive
            ? 'bg-blue-500/40 text-white shadow-lg scale-100'
            : 'text-blue-100 hover:bg-blue-500/20 hover:text-white transform hover:translate-x-1'
        }
      `}
    >
      <span className="
        text-xl flex-shrink-0 
        transition-all duration-300
        group-hover:scale-110
      ">
        {icon}
      </span>
      <span 
        className={`
          text-sm font-medium whitespace-nowrap
          overflow-hidden transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}
        `}
      >
        {label}
      </span>
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