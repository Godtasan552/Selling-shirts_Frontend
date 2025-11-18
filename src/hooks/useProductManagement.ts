// ============================================
// hooks/useProductManagement.ts - FIXED
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
  updateProductStatus: (productId: string, status: string) => Promise<boolean>;
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

  // ✅ FIXED: Removed imageFile parameter - frontend handles images
  const createProduct = useCallback(async (
    formData: FormDataType
  ): Promise<boolean> => {
    console.log('🎯 createProduct called with:');
    console.log('   - Data:', formData);

    if (!formData.name || !formData.description) {
      setError('Name and description are required');
      return false;
    }

    try {
      setLoading(true);
      setError('');

      console.log('📡 Sending POST to:', `${apiUrl}/api/products`);

      const res = await fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📥 Response status:', res.status);

      if (!res.ok) {
        const errData = await res.json();
        console.error('❌ Error response:', errData);
        setError(errData.message || 'Failed to save product');
        return false;
      }

      const result = await res.json();
      console.log('✅ Product created successfully:', result);

      await fetchProducts();
      return true;
    } catch (err) {
      console.error('❌ Error in createProduct:', err);
      setError('Error creating product');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl, fetchProducts]);

  // ✅ FIXED: Removed imageFile parameter
  const updateProduct = useCallback(async (
    productId: string, 
    formData: FormDataType
  ): Promise<boolean> => {
    console.log('🎯 updateProduct called with:');
    console.log('   - Product ID:', productId);
    console.log('   - Data:', formData);

    try {
      setLoading(true);
      setError('');

      console.log('📡 Sending PUT to:', `${apiUrl}/api/products/${productId}`);

      const res = await fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📥 Response status:', res.status);

      if (!res.ok) {
        const errData = await res.json();
        console.error('❌ Error response:', errData);
        setError(errData.message || 'Failed to update product');
        return false;
      }

      const result = await res.json();
      console.log('✅ Product updated successfully:', result);

      await fetchProducts();
      return true;
    } catch (err) {
      console.error('❌ Error in updateProduct:', err);
      setError('Error updating product');
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl, fetchProducts]);

  // ✨ Update product status only
  const updateProductStatus = useCallback(async (productId: string, status: string): Promise<boolean> => {
    try {
      setError('');
      const res = await fetch(`${apiUrl}/api/products/${productId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || 'Failed to update product status');
        return false;
      }

      // Update local state
      setProducts(prev =>
        prev.map(p => p._id === productId ? { ...p, status } : p)
      );
      return true;
    } catch (err) {
      setError('Error updating product status');
      console.error(err);
      return false;
    }
  }, [token, apiUrl]);

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

  return { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    updateProductStatus,
  };
}