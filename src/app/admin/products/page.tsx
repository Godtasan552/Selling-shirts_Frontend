'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useProductManagement } from '@/hooks/useProductManagement';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { ProductsTab } from '@/components/products_copn/ProductsTab';
import { OrdersTab } from '@/components/products_copn/OrdersTab';
import { Product } from '../../../types/product_admin';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const initRef = useRef(false);

  // Product Management Hook
  const productMgmt = useProductManagement(token, API_URL);

  // Order Management Hook
  const orderMgmt = useOrderManagement(token, API_URL);

  // Initialize dashboard - runs only once on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch data when token is available
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          productMgmt.fetchProducts(),
          orderMgmt.fetchOrders(),
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // ✅ Only depend on token, not on productMgmt/orderMgmt which change on every render
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Product</h1>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" role="tablist">
            {[
              { id: 'products', label: 'Products Management' },
              { id: 'orders', label: 'Orders Management' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'products' | 'orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Products Tab */}
            {activeTab === 'products' && (
              <ProductsTab
                products={productMgmt.products}
                loading={productMgmt.loading}
                error={productMgmt.error}
                onCreateProduct={productMgmt.createProduct}
                onUpdateProduct={productMgmt.updateProduct}
                onDeleteProduct={productMgmt.deleteProduct}
                onUpdateProductStatus={productMgmt.updateProductStatus}
              />
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <OrdersTab
                orders={orderMgmt.orders}
                loading={orderMgmt.loading}
                error={orderMgmt.error}
                onConfirmOrder={orderMgmt.confirmOrder}
                onRejectOrder={orderMgmt.rejectOrder}
                onUpdateOrderStatus={orderMgmt.updateOrderStatus}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}