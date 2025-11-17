// ============================================
// 1. hooks/useProductManagement.ts - NEW
// ============================================
import { useState, useCallback } from 'react';
import type { Product, FormDataType } from '@/types/product_admin';

interface UseProductManagementReturn {
  products: Product[];
  loading: boolean;
  error: string;
  fetchProducts: () => Promise<void>;
  createProduct: (data: FormDataType) => Promise<boolean>;
  updateProduct: (productId: string, data: FormDataType) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
}

export function useProductManagement(token: string, apiUrl: string): UseProductManagementReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${apiUrl}/api/products?limit=50`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      const errMsg = 'Failed to fetch products';
      setError(errMsg);
      console.error(errMsg, err);
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl]);

  const createProduct = useCallback(async (formData: FormDataType): Promise<boolean> => {
    if (!formData.name || !formData.description) {
      setError('Name and description are required');
      return false;
    }

    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || 'Failed to save product');
        return false;
      }

      await fetchProducts();
      return true;
    } catch (err) {
      setError('Error creating product');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl, fetchProducts]);

  const updateProduct = useCallback(async (productId: string, formData: FormDataType): Promise<boolean> => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || 'Failed to update product');
        return false;
      }

      await fetchProducts();
      return true;
    } catch (err) {
      setError('Error updating product');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl, fetchProducts]);

  const deleteProduct = useCallback(async (productId: string): Promise<boolean> => {
    if (!window.confirm('Are you sure you want to delete this product?')) return false;

    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) {
        setError('Failed to delete product');
        return false;
      }

      await fetchProducts();
      return true;
    } catch (err) {
      setError('Error deleting product');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl, fetchProducts]);

  return { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct };
}
