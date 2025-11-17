'use client';

import { usePathname, useRouter } from 'next/navigation';
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

  // Authentication checking
  useEffect(() => {
    const checkAuth = async () => {
      // Check token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/admin_login');
        setIsChecking(false);
        return;
      }

      setIsAuthenticated(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = () => {
    // ลบข้อมูลทั้งหมด
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');

    // Reset state
    setIsAuthenticated(false);
    setIsChecking(false);

    // Redirect ไปหน้า login
    router.push('/admin_login');
  };

  // During authentication check
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated → return nothing (redirect handled above)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated → show layout
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
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
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
        <div className="p-6">{children}</div>
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