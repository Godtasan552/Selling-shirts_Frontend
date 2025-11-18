// components/admin/ProductsTab.tsx
// ============================================
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import type { Product, FormDataType } from '@/types/product_admin';
import { PRODUCT_STATUS } from '@/types/product_admin';
import { ProductModal } from './ProductModal';
import { useState } from 'react';

interface ProductsTabProps {
  products: Product[];
  loading: boolean;
  error: string;
  onCreateProduct: (data: FormDataType) => Promise<boolean>;
  onUpdateProduct: (productId: string, data: FormDataType) => Promise<boolean>;
  onDeleteProduct: (productId: string) => Promise<boolean>;
  onUpdateProductStatus?: (productId: string, status: string) => Promise<boolean>;
}

export function ProductsTab({
  products,
  loading,
  error,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateProductStatus,
}: ProductsTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalError, setModalError] = useState('');
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState('');

  const handleSaveProduct = async (formData: FormDataType) => {
    setIsModalLoading(true);
    setModalError('');

    const success = editingProduct
      ? await onUpdateProduct(editingProduct._id, formData)
      : await onCreateProduct(formData);

    if (success) {
      setShowModal(false);
      setEditingProduct(null);
    } else {
      setModalError('Failed to save product');
    }
    setIsModalLoading(false);
  };

  const handleUpdateStatus = async (productId: string, newStatus: string) => {
    if (!onUpdateProductStatus) {
      setStatusError('Status update not available');
      return;
    }

    try {
      setUpdatingStatusId(productId);
      setStatusError('');
      const success = await onUpdateProductStatus(productId, newStatus);
      if (!success) {
        setStatusError('Failed to update status');
      }
    } catch (err) {
      setStatusError('Error updating status');
      console.error(err);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setModalError('');
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {statusError && (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded mb-4 flex gap-2">
          <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
          <p className="text-orange-800">{statusError}</p>
        </div>
      )}

      <ProductModal
        isOpen={showModal}
        isLoading={isModalLoading}
        error={modalError}
        editingProduct={editingProduct}
        onClose={() => setShowModal(false)}
        onSave={handleSaveProduct}
      />

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
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.variants?.length || 0}</td>
                  
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={product.status}
                      onChange={(e) => handleUpdateStatus(product._id, e.target.value)}
                      disabled={updatingStatusId === product._id}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        PRODUCT_STATUS[product.status as keyof typeof PRODUCT_STATUS]?.color || 'bg-gray-100'
                      } ${updatingStatusId === product._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {Object.entries(PRODUCT_STATUS).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val.label}
                        </option>
                      ))}
                    </select>
                    {updatingStatusId === product._id && (
                      <span className="ml-2 text-xs text-gray-500">Updating...</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm flex gap-3">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit product"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product._id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete product"
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
  );
}