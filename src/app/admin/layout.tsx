// ========================================
// app/admin/layout.tsx
// ========================================
'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  // ถ้าเป็นหน้า login ให้แสดง children เฉยๆ
  if (isLoginPage) {
    return <>{children}</>;
  }

  // ถ้าไม่ใช่หน้า login ให้แสดงพร้อม sidebar
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ease-in-out shadow-lg flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold">Admin</h1>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
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
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {getPageTitle(pathname)}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// ========================================
// Nav Item Component
// ========================================
interface NavItemProps {
  href: string;
  label: string;
  icon: string;
  sidebarOpen: boolean;
  isActive: boolean;
}

function NavItem({ href, label, icon, sidebarOpen, isActive }: NavItemProps) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-purple-600 text-white shadow-md'
          : 'text-gray-300 hover:bg-slate-700'
      }`}
    >
      <span className="text-xl">{icon}</span>
      {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
    </a>
  );
}

// ========================================
// Helper Function
// ========================================
function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/users': 'Users',
    '/admin/admin-users': 'Admin Users',
    '/admin/products': 'Products',
    '/admin/settings': 'Settings',
  };
  return titles[pathname] || 'Admin Panel';
}