// hooks/useDashboard.ts
import { useState, useEffect } from 'react';

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

// Admin User
export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "staff";
  permissions?: string[];
  isActive: boolean;
  createdAt: string;
}

// Dashboard Statistics
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
  totalRevenue: number;
  pendingOrders: number;
  totalInventory: number;
  averageProductPrice: number;
}

// Orders
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
  status: "pending_payment" | "verifying_payment" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentSlip?: string;
  approvedBy?: string;
  paidAt?: Date;
  createdAt: string;
  updatedAt?: string;
}

// Users
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

// Hook Return Type
interface UseDashboardReturn {
  stats: DashboardStats | null;
  products: IProduct[];
  orders: Order[];
  users: User[];
  admins: AdminUser[];
  loading: boolean;
  error: string;
  packages: Package[];
}

// Custom Hook
export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        if (!token) throw new Error('No authentication token found');

        // Fetch products
        const productsResponse = await fetch(`${apiUrl}/api/products`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const productsData = await productsResponse.json();
        const productsList: IProduct[] = Array.isArray(productsData.data)
          ? productsData.data
          : Array.isArray(productsData)
          ? productsData
          : [];

        setProducts(productsList.slice(0, 10));

        // สร้าง packages จาก products
        const packageList: Package[] = productsList.slice(0, 5).map(p => ({
          id: p._id,
          name: p.name,
          price: p.variants.reduce((sum, v) => sum + v.price, 0) / (p.variants.length || 1),
          description: p.description,
          variants: p.variants,
        }));
        setPackages(packageList);

        // Fetch orders - ดึงจาก admin endpoint
        let ordersList: Order[] = [];
        let totalOrdersCount = 0;
        let pendingOrdersCount = 0;
        let verifyingOrdersCount = 0;

        try {
          const ordersResponse = await fetch(`${apiUrl}/api/admin/orders/all`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            ordersList = Array.isArray(ordersData.orders) ? ordersData.orders : [];
            totalOrdersCount = ordersData.count || ordersList.length;

            // นับจำนวนตามสถานะ
            verifyingOrdersCount = ordersList.filter(o => o.status === 'verifying_payment').length;
            pendingOrdersCount = ordersList.filter(o => o.status === 'pending_payment').length;

            setOrders(ordersList.slice(0, 10));
          } else {
            console.warn('Failed to fetch orders:', ordersResponse.status);
          }
        } catch (err) {
          console.warn('Error fetching orders:', err);
        }

        // Fetch normal users
        const usersResponse = await fetch(`${apiUrl}/api/admin/users?limit=100`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        let usersList: User[] = [];
        let totalUsers = 0;
        let verifiedUsers = 0;
        let unverifiedUsers = 0;
        let phoneUsers = 0;
        let googleUsers = 0;

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          usersList = Array.isArray(usersData.data) ? usersData.data : [];
          
          totalUsers = usersData.pagination?.total || usersList.length;
          verifiedUsers = usersList.filter(u => u.verified).length;
          unverifiedUsers = usersList.filter(u => !u.verified).length;
          phoneUsers = usersList.filter(u => u.phone && !u.googleId).length;
          googleUsers = usersList.filter(u => u.googleId).length;

          setUsers(usersList.slice(0, 5));
        } else {
          console.warn('Failed to fetch users:', usersResponse.status);
        }

        // Fetch admin users
        let adminList: AdminUser[] = [];
        let totalAdmins = 0;
        let totalStaff = 0;

        try {
          const adminsResponse = await fetch(`${apiUrl}/api/admin/admin-users`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (adminsResponse.ok) {
            const adminsData = await adminsResponse.json();
            adminList = Array.isArray(adminsData.data) ? adminsData.data : [];
            
            totalAdmins = adminList.filter(a => a.role === 'admin').length;
            totalStaff = adminList.filter(a => a.role === 'staff').length;

            setAdmins(adminList);
          } else {
            console.warn('Failed to fetch admins:', adminsResponse.status);
          }
        } catch (err) {
          console.warn('Failed to fetch admin users:', err);
        }

        // คำนวณ stats
        const totalInventory = productsList.reduce((sum, product) => {
          return sum + product.variants.reduce((variantSum, variant) => variantSum + (variant.quantity || 0), 0);
        }, 0);

        const totalProductRevenue = productsList.reduce((sum, product) => {
          return sum + product.variants.reduce((variantSum, variant) => {
            return variantSum + (variant.price * (variant.quantity || 0));
          }, 0);
        }, 0);

        const averagePrice = productsList.length > 0
          ? productsList.reduce((sum, product) => {
              const avgProductPrice = product.variants.length > 0
                ? product.variants.reduce((sum, v) => sum + v.price, 0) / product.variants.length
                : 0;
              return sum + avgProductPrice;
            }, 0) / productsList.length
          : 0;

        // คำนวณ total revenue จากออเดอร์ที่ชำระแล้ว
        const totalOrderRevenue = ordersList
          .filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
          .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        const totalOrders = totalOrdersCount;
        const pendingOrders = verifyingOrdersCount + pendingOrdersCount;

        setStats({
          admins: {
            total: totalAdmins + totalStaff,
            admin: totalAdmins,
            staff: totalStaff,
          },
          users: {
            total: totalUsers,
            verified: verifiedUsers,
            unverified: unverifiedUsers,
            byProvider: {
              phone: phoneUsers,
              google: googleUsers,
            },
          },
          totalProducts: productsList.length,
          totalOrders,
          totalRevenue: totalProductRevenue,
          pendingOrders,
          totalInventory,
          averageProductPrice: averagePrice,
        });

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    stats,
    products,
    orders,
    users,
    admins,
    loading,
    error,
    packages,
  };
}