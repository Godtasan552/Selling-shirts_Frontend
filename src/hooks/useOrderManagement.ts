// ============================================
// 2. hooks/useOrderManagement.ts - NEW
// ============================================
import { useState, useCallback } from 'react';
import type { Order } from '@/types/product_admin';

interface UseOrderManagementReturn {
  orders: Order[];
  loading: boolean;
  error: string;
  fetchOrders: () => Promise<void>;
  confirmOrder: (orderId: string) => Promise<boolean>;
  rejectOrder: (orderId: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
}

export function useOrderManagement(token: string, apiUrl: string): UseOrderManagementReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/admin/orders/all`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl]);

  const confirmOrder = useCallback(async (orderId: string): Promise<boolean> => {
    try {
      setError('');
      const res = await fetch(`${apiUrl}/api/admin/orders/${orderId}/confirm`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        setError('Failed to confirm order');
        return false;
      }
      await fetchOrders();
      return true;
    } catch (err) {
      setError('Error confirming order');
      console.error(err);
      return false;
    }
  }, [token, apiUrl, fetchOrders]);

  const rejectOrder = useCallback(async (orderId: string): Promise<boolean> => {
    try {
      setError('');
      const res = await fetch(`${apiUrl}/api/admin/orders/${orderId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        setError('Failed to reject order');
        return false;
      }
      await fetchOrders();
      return true;
    } catch (err) {
      setError('Error rejecting order');
      console.error(err);
      return false;
    }
  }, [token, apiUrl, fetchOrders]);

  const updateOrderStatus = useCallback(async (orderId: string, status: string): Promise<boolean> => {
    try {
      setError('');
      const res = await fetch(`${apiUrl}/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        setError('Failed to update order status');
        return false;
      }
      await fetchOrders();
      return true;
    } catch (err) {
      setError('Error updating status');
      console.error(err);
      return false;
    }
  }, [token, apiUrl, fetchOrders]);

  return { orders, loading, error, fetchOrders, confirmOrder, rejectOrder, updateOrderStatus };
}
