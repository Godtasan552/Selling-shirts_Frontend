"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, X, ChevronDown } from 'lucide-react';

interface Variant {
  size: string;
  color: string;
  sku: string;
  price: number;
  quantity: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  status: string;
  variants: Variant[];
}

interface OrderItem {
  name: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  totalPrice: number;
  shippingCost: number;
  status: string;
  items: OrderItem[];
  paymentSlip?: string;
}

interface FormDataType {
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  status: string;
  variants: Variant[];
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    description: '',
    category: 't-shirt',
    imageUrl: '',
    status: 'active',
    variants: [{ size: 'M', color: '', sku: '', price: 0, quantity: 0 }],
  });

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    setToken(storedToken || '');
  }, []);

  useEffect(() => {
    if (token) {
      fetchProducts();
      fetchOrders();
    }
  }, [token]);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_URL}/api/products?limit=50`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      const errMsg = 'Failed to fetch products';
      console.error(errMsg, err);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/admin/orders/all`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (): Promise<void> => {
    if (!formData.name || !formData.description) {
      setError('Name and description are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const url = editingProduct
        ? `${API_URL}/api/products/${editingProduct._id}`
        : `${API_URL}/api/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchProducts();
        setShowModal(false);
        setEditingProduct(null);
        setFormData({
          name: '',
          description: '',
          category: 't-shirt',
          imageUrl: '',
          status: 'active',
          variants: [{ size: 'M', color: '', sku: '', price: 0, quantity: 0 }],
        });
      } else {
        const errData = await res.json();
        setError(errData.message || 'Failed to save product');
      }
    } catch (err) {
      console.error('Create product error:', err);
      setError('Error creating product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string): Promise<void> => {
    if (!window.confirm('Are you sure?')) return;
    try {
      setError('');
      const res = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchProducts();
      } else {
        setError('Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Error deleting product');
    }
  };

  const handleEditProduct = (product: Product): void => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      imageUrl: product.imageUrl || '',
      status: product.status,
      variants: product.variants || [{ size: 'M', color: '', sku: '', price: 0, quantity: 0 }],
    });
    setError('');
    setShowModal(true);
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number): void => {
    const newVariants = [...formData.variants];
    newVariants[index] = { 
      ...newVariants[index], 
      [field]: (field === 'price' || field === 'quantity') ? Number(value) : value 
    };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleAddVariant = (): void => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: 'M', color: '', sku: '', price: 0, quantity: 0 }],
    });
  };

  const handleConfirmOrder = async (orderId: string): Promise<void> => {
    try {
      setError('');
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/confirm`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchOrders();
      } else {
        setError('Failed to confirm order');
      }
    } catch (err) {
      console.error('Confirm order error:', err);
      setError('Error confirming order');
    }
  };

  const handleRejectOrder = async (orderId: string): Promise<void> => {
    try {
      setError('');
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchOrders();
      } else {
        setError('Failed to reject order');
      }
    } catch (err) {
      console.error('Reject order error:', err);
      setError('Error rejecting order');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string): Promise<void> => {
    try {
      setError('');
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchOrders();
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      console.error('Update status error:', err);
      setError('Error updating status');
    }
  };

  const getStatusBadge = (status: string): string => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      discontinued: 'bg-red-100 text-red-800',
      pending_payment: 'bg-yellow-100 text-yellow-800',
      verifying_payment: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      shipping: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 m-4 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" role="tablist">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Products Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders Management
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setError('');
                  setFormData({
                    name: '',
                    description: '',
                    category: 't-shirt',
                    imageUrl: '',
                    status: 'active',
                    variants: [{ size: 'M', color: '', sku: '', price: 0, quantity: 0 }],
                  });
                  setShowModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={20} /> Add Product
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No products found</div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Variants</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.variants?.length || 0}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-3">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="verifying_payment">Verifying Payment</option>
                <option value="paid">Paid</option>
                <option value="shipping">Shipping</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No orders found</div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg shadow">
                    <div
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.customerName}</h3>
                        <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                        <p className="text-sm text-gray-600">{order.customerPhone}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">฿{order.totalPrice?.toFixed(2) || '0.00'}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                            {order.status?.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <ChevronDown size={20} className={expandedOrder === order._id ? 'rotate-180' : ''} />
                      </div>
                    </div>

                    {expandedOrder === order._id && (
                      <div className="border-t p-4 bg-gray-50 space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
                          <div className="space-y-2">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="text-sm text-gray-600">
                                {item.name} - Size: {item.size} (x{item.quantity}) - ฿{(item.price * item.quantity).toFixed(2)}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-sm"><strong>Address:</strong> {order.customerAddress}</p>
                          <p className="text-sm"><strong>Email:</strong> {order.customerEmail}</p>
                          <p className="text-sm"><strong>Shipping:</strong> ฿{order.shippingCost?.toFixed(2) || '0.00'}</p>
                        </div>

                        {order.status === 'verifying_payment' && order.paymentSlip && (
                          <div className="border-t pt-4">
                            <p className="font-semibold text-gray-900 mb-2">Payment Slip</p>
                            <img src={order.paymentSlip} alt="Payment slip" className="w-32 h-32 object-cover rounded" />
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleConfirmOrder(order._id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                              >
                                <Check size={18} /> Confirm
                              </button>
                              <button
                                onClick={() => handleRejectOrder(order._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
                              >
                                <X size={18} /> Reject
                              </button>
                            </div>
                          </div>
                        )}

                        {['paid', 'shipping', 'completed'].includes(order.status) && (
                          <div className="border-t pt-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className="px-3 py-2 border rounded bg-white text-sm"
                            >
                              <option value="paid">Paid</option>
                              <option value="shipping">Shipping</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded mb-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="t-shirt">T-Shirt</option>
                      <option value="polo">Polo</option>
                      <option value="hoodie">Hoodie</option>
                      <option value="jacket">Jacket</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Variants</label>
                  <div className="space-y-3 bg-gray-50 p-3 rounded max-h-48 overflow-y-auto">
                    {formData.variants.map((variant, idx) => (
                      <div key={idx} className="grid grid-cols-5 gap-2">
                        <select
                          value={variant.size}
                          onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                        >
                          <option>S</option>
                          <option>SS</option>
                          <option>M</option>
                          <option>L</option>
                          <option>XL</option>
                          <option>2XL</option>
                          <option>3XL</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Color"
                          value={variant.color}
                          onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="SKU"
                          value={variant.sku}
                          onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          value={variant.quantity}
                          onChange={(e) => handleVariantChange(idx, 'quantity', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="mt-2 text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    + Add Variant
                  </button>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={handleCreateProduct}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}