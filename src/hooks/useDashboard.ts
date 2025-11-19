// ============================================
// 1. hooks/useDashboard.ts - REFACTORED
// ============================================
import { useState, useEffect, useCallback } from 'react';

export interface IVariant {
  size: string;
  color?: string;
  sku: string;
  price: number;
  quantity: number;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  category: string;
  variants: IVariant[];
  image?: string;
  imageUrl?: string;
  status: "active" | "inactive" | "discontinued";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description?: string;
  variants?: IVariant[];
}

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "staff";
  permissions?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface DashboardStats {
  admins: {
    total: number;
    admin: number;
    staff: number;
  };
  users: {
    total: number;
    verified: number;
    unverified: number;
    byProvider: {
      phone: number;
      google: number;
    };
  };
  totalProducts: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  orderRevenue: number;
  pendingOrders: number;
  totalInventory: number;
  averageProductPrice: number;
  totalShirtsSold: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  color?: string;
  sku: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  note?: string;
  items: OrderItem[];
  totalProductPrice: number;
  shippingCost: number;
  totalPrice: number;
  status: "pending_payment" | "verifying_payment" | "paid" | "shipping" | "completed" | "cancelled";
  paymentSlip?: string;
  approvedBy?: string;
  paidAt?: Date;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  phone?: string;
  email?: string;
  name?: string;
  picture?: string;
  verified: boolean;
  googleId?: string;
  createdAt: string;
}

interface UseDashboardReturn {
  stats: DashboardStats | null;
  products: IProduct[];
  orders: Order[];
  users: User[];
  admins: AdminUser[];
  loading: boolean;
  error: string;
  packages: Package[];
  refetch: () => void;
}

// สำหรับการหา stats ตั้งแต่ raw data
const calculateStats = (
  products: IProduct[],
  orders: Order[],
  users: User[],
  admins: AdminUser[]
): DashboardStats => {
  const totalInventory = products.reduce((sum, product) => {
    return sum + product.variants.reduce((variantSum, variant) => 
      variantSum + (variant.quantity || 0), 0);
  }, 0);

  const totalProductRevenue = products.reduce((sum, product) => {
    return sum + product.variants.reduce((variantSum, variant) => {
      return variantSum + (variant.price * (variant.quantity || 0));
    }, 0);
  }, 0);

  const averagePrice = products.length > 0
    ? products.reduce((sum, product) => {
        const avgProductPrice = product.variants.length > 0
          ? product.variants.reduce((sum, v) => sum + v.price, 0) / product.variants.length
          : 0;
        return sum + avgProductPrice;
      }, 0) / products.length
    : 0;

  const totalOrderRevenue = orders
    .filter(o => ['paid', 'shipping', 'completed'].includes(o.status))
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const verifiedUsers = users.filter(u => u.verified).length;
  const phoneUsers = users.filter(u => u.phone && !u.googleId).length;
  const googleUsers = users.filter(u => u.googleId).length;

  const totalAdmins = admins.filter(a => a.role === 'admin').length;
  const totalStaff = admins.filter(a => a.role === 'staff').length;

  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => 
    ['pending_payment', 'verifying_payment'].includes(o.status)
  ).length;

  const totalShirtsSold = orders
    .filter(o => ['paid', 'shipping', 'completed'].includes(o.status))
    .reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0), 
    0);

  return {
    admins: {
      total: totalAdmins + totalStaff,
      admin: totalAdmins,
      staff: totalStaff,
    },
    users: {
      total: users.length,
      verified: verifiedUsers,
      unverified: users.length - verifiedUsers,
      byProvider: {
        phone: phoneUsers,
        google: googleUsers,
      },
    },
    totalProducts: products.length,
    totalOrders: orders.length,
    completedOrders,
    totalRevenue: totalProductRevenue,
    orderRevenue: totalOrderRevenue,
    pendingOrders,
    totalInventory,
    averageProductPrice: averagePrice,
    totalShirtsSold,
  };
};

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [packages, setPackages] = useState<Package[]>([]);

  const getToken = useCallback(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'NEXT_PUBLIC_API_URL';
      const token = getToken();

      if (!token) throw new Error('No authentication token found');

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch all data in parallel
      const [productsRes, ordersRes, usersRes, adminsRes] = await Promise.allSettled([
        fetch(`${apiUrl}/api/products`, { method: 'GET', headers }),
        fetch(`${apiUrl}/api/admin/orders/all`, { headers }),
        fetch(`${apiUrl}/api/admin/users?limit=100`, { headers }),
        fetch(`${apiUrl}/api/admin/admin-users`, { headers }),
      ]);

      // Handle products
      let productsList: IProduct[] = [];
      if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
        const data = await productsRes.value.json();
        productsList = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        setProducts(productsList.slice(0, 10));

        // Create packages from products
        const packageList: Package[] = productsList.slice(0, 5).map(p => ({
          id: p._id,
          name: p.name,
          price: p.variants.reduce((sum, v) => sum + v.price, 0) / (p.variants.length || 1),
          description: p.description,
          variants: p.variants,
        }));
        setPackages(packageList);
      }

      // Handle orders
      let ordersList: Order[] = [];
      if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
        const data = await ordersRes.value.json();
        ordersList = Array.isArray(data.orders) ? data.orders : [];
        setOrders(ordersList.slice(0, 10));
      }

      // Handle users
      let usersList: User[] = [];
      if (usersRes.status === 'fulfilled' && usersRes.value.ok) {
        const data = await usersRes.value.json();
        usersList = Array.isArray(data.data) ? data.data : [];
        setUsers(usersList.slice(0, 5));
      }

      // Handle admins
      let adminList: AdminUser[] = [];
      if (adminsRes.status === 'fulfilled' && adminsRes.value.ok) {
        const data = await adminsRes.value.json();
        adminList = Array.isArray(data.data) ? data.data : [];
        setAdmins(adminList);
      }

      // Calculate and set stats
      const calculatedStats = calculateStats(productsList, ordersList, usersList, adminList);
      setStats(calculatedStats);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    products,
    orders,
    users,
    admins,
    loading,
    error,
    packages,
    refetch: fetchDashboardData,
  };
}
