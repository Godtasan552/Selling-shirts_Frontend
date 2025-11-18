// ============================================
// hooks/useOrderManagement.ts - DEBUG VERSION
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
      setError('');
      const res = await fetch(`${apiUrl}/api/admin/orders/all`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.status}`);
      }

      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to fetch orders';
      console.error('Fetch orders error:', errMsg);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl]);

  const confirmOrder = useCallback(async (orderId: string): Promise<boolean> => {
    try {
      setError('');
      console.log(`Confirming order: ${orderId}`);
      
      const res = await fetch(`${apiUrl}/api/admin/orders/${orderId}/confirm`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        const errMsg = errData.message || `HTTP ${res.status}`;
        console.error('Confirm error:', errMsg);
        setError(`Failed to confirm order: ${errMsg}`);
        return false;
      }

      await fetchOrders();
      return true;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Error confirming order';
      console.error('Confirm error:', errMsg);
      setError(errMsg);
      return false;
    }
  }, [token, apiUrl, fetchOrders]);

  const rejectOrder = useCallback(async (orderId: string): Promise<boolean> => {
    try {
      setError('');
      console.log(`Rejecting order: ${orderId}`);
      
      const res = await fetch(`${apiUrl}/api/admin/orders/${orderId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        const errMsg = errData.message || `HTTP ${res.status}`;
        console.error('Reject error:', errMsg);
        setError(`Failed to reject order: ${errMsg}`);
        return false;
      }

      await fetchOrders();
      return true;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Error rejecting order';
      console.error('Reject error:', errMsg);
      setError(errMsg);
      return false;
    }
  }, [token, apiUrl, fetchOrders]);

  const updateOrderStatus = useCallback(
    async (orderId: string, status: string): Promise<boolean> => {
      try {
        setError('');
        console.log(`Updating order ${orderId} status to: ${status}`);
        
        const url = `${apiUrl}/api/admin/orders/${orderId}/status`;
        const payload = { status };

        console.log('Request URL:', url);
        console.log('Payload:', payload);
        console.log('Token:', token ? 'Present' : 'Missing');

        const res = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        console.log('Response status:', res.status);

        if (!res.ok) {
          // ✨ Try to parse error response
          let errMsg = `HTTP ${res.status}`;
          try {
            const errData = await res.json();
            errMsg = errData.message || errMsg;
          } catch {
            const text = await res.text();
            errMsg = text || errMsg;
          }

          console.error('Update status error:', errMsg);
          setError(`Failed to update order status: ${errMsg}`);
          return false;
        }

        // ✨ Update local state first for better UX
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, status } : order
          )
        );

        // Then sync with server
        await fetchOrders();
        return true;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Error updating status';
        console.error('Update status error:', errMsg);
        setError(errMsg);
        return false;
      }
    },
    [token, apiUrl, fetchOrders]
  );

  return {
    orders,
    loading,
    error,
    fetchOrders,
    confirmOrder,
    rejectOrder,
    updateOrderStatus,
  };
}