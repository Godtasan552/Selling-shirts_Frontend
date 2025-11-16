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

// Dashboard Statistics
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalInventory: number;
  averageProductPrice: number;
}

// Orders
export interface Order {
  _id: string;
  customerName: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

// Users
export interface User {
  _id: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  createdAt: string;
}

// Hook Return Type
interface UseDashboardReturn {
  stats: DashboardStats | null;
  products: IProduct[];
  orders: Order[];
  users: User[];
  loading: boolean;
  error: string;
  packages: Package[]; // เพิ่ม packages
}

// Custom Hook
export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [packages, setPackages] = useState<Package[]>([]); // state สำหรับ packages

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'NEXT_PUBLIC_API_URL';
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

        // ตัวอย่างสร้าง packages จาก products (สมมติเลือก 5 ตัวแรก)
        const packageList: Package[] = productsList.slice(0, 5).map(p => ({
          id: p._id,
          name: p.name,
          price: p.variants.reduce((sum, v) => sum + v.price, 0) / (p.variants.length || 1),
          description: p.description,
          variants: p.variants,
        }));
        setPackages(packageList);

        // Fetch orders
        const ordersResponse = await fetch(`${apiUrl}/api/orders`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        let ordersList: Order[] = [];
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          ordersList = Array.isArray(ordersData.data) ? ordersData.data : [];
          setOrders(ordersList.slice(0, 5));
        }

        // Fetch users
        const usersResponse = await fetch(`${apiUrl}/api/users`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        let usersList: User[] = [];
        let totalUsers = 0;
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          usersList = Array.isArray(usersData.data) ? usersData.data : [];
          totalUsers = usersList.length;
          setUsers(usersList.slice(0, 5));
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

        const totalOrders = ordersList.length;
        const pendingOrders = ordersList.filter(o =>
          o.status === 'verifying_payment' || o.status === 'pending_payment'
        ).length;

        setStats({
          totalUsers,
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
    loading,
    error,
    packages, // คืนค่า packages
  };
}
