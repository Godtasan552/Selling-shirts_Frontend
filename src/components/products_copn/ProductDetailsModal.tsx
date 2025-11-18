// components/admin/ProductDetailsModal.tsx
// =============================================
import { X, Package, Info, Layers } from 'lucide-react';
import Image from 'next/image';
import type { Product } from '@/types/product_admin';
import { PRODUCT_STATUS } from '@/types/product_admin';

interface ProductDetailsModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailsModal({
  isOpen,
  product,
  onClose,
}: ProductDetailsModalProps) {
  if (!isOpen || !product) return null;

  const statusInfo = PRODUCT_STATUS[product.status as keyof typeof PRODUCT_STATUS];
  
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleString('th-TH');
    } catch {
      return '-';
    }
  };

  const createdAtDate = formatDate(product.createdAt);
  const updatedAtDate = formatDate(product.updatedAt);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-50 border-b flex justify-between items-center p-6">
          <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Image */}
          {product.imageUrl && (
            <div className="flex justify-center">
              <div className="relative w-full h-64 rounded-lg overflow-hidden shadow">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex gap-2 mb-3">
              <Info size={20} className="text-blue-600 flex-shrink-0" />
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
            </div>
            <div className="space-y-3 ml-7">
              <div>
                <p className="text-sm text-gray-600">Product Name</p>
                <p className="font-semibold text-gray-900">{product.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold text-gray-900 capitalize">{product.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusInfo?.color || 'bg-gray-100'
                    }`}
                  >
                    {statusInfo?.label || product.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex gap-2 mb-3">
                <Layers size={20} className="text-green-600 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900">
                  Variants ({product.variants.length})
                </h3>
              </div>
              <div className="ml-7 space-y-3">
                {product.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="bg-white rounded p-3 border border-green-100"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Size</p>
                        <p className="font-semibold text-gray-900">{variant.size}</p>
                      </div>
                      {variant.color && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase">Color</p>
                          <p className="font-semibold text-gray-900">{variant.color}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 uppercase">SKU</p>
                        <p className="font-semibold text-gray-900 text-sm">{variant.sku}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Price</p>
                        <p className="font-semibold text-gray-900">
                          ฿{variant.price.toLocaleString('th-TH')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Quantity</p>
                        <p
                          className={`font-semibold ${
                            variant.quantity > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {variant.quantity} units
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta Information */}
          {(product.createdBy || product.updatedBy || product.createdAt || product.updatedAt) && (
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex gap-2 mb-3">
                <Package size={20} className="text-gray-600 flex-shrink-0" />
                <h3 className="font-semibold text-gray-900">Meta Information</h3>
              </div>
              <div className="ml-7 space-y-2 text-sm">
                {product.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created At:</span>
                    <span className="font-medium text-gray-900">{createdAtDate}</span>
                  </div>
                )}
                {product.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updated At:</span>
                    <span className="font-medium text-gray-900">{updatedAtDate}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t p-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}