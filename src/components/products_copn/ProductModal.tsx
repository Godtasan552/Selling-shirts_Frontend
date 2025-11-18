import { useState } from 'react';
import { X, Plus, Trash2, Upload, Image } from 'lucide-react';

// Types
interface Variant {
  size: string;
  color: string;
  sku: string;
  price: number;
  quantity: number;
}

interface FormDataType {
  name: string;
  description: string;
  category: string;
  status: string;
  variants: Variant[];
}

interface Product extends FormDataType {
  _id: string;
  imageUrl?: string;
}

interface ProductModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string;
  editingProduct: Product | null;
  onClose: () => void;
  onSave: (data: FormDataType, imageFile: File | null) => void;
}

const CATEGORIES = ['t-shirt', 'polo', 'hoodie', 'jacket', 'other'];
const SIZES = ['S', 'SS', 'SSS', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
const PRODUCT_STATUS = {
  active: { label: 'Active', color: 'success' },
  inactive: { label: 'Inactive', color: 'warning' },
  discontinued: { label: 'Discontinued', color: 'error' }
};

const initialFormData: FormDataType = {
  name: '',
  description: '',
  category: 't-shirt',
  status: 'active',
  variants: [{ size: 'M', color: '', sku: '', price: 0, quantity: 0 }],
};

export function ProductModal({
  isOpen,
  isLoading,
  error,
  editingProduct,
  onClose,
  onSave,
}: ProductModalProps) {
  // ✅ กำหนดค่าเริ่มต้นตาม editingProduct
  const initialData = editingProduct 
    ? {
        name: editingProduct.name,
        description: editingProduct.description,
        category: editingProduct.category,
        status: editingProduct.status,
        variants: editingProduct.variants
      }
    : initialFormData;

  const [formData, setFormData] = useState<FormDataType>(initialData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    editingProduct?.imageUrl || ''
  );

  // Handle image file selection
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string | number
  ): void => {
    const newVariants = [...formData.variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: field === 'price' || field === 'quantity' ? Number(value) : value,
    };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleAddVariant = (): void => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { size: 'M', color: '', sku: '', price: 0, quantity: 0 },
      ],
    });
  };

  const handleRemoveVariant = (index: number): void => {
    if (formData.variants.length === 1) {
      alert('At least one variant is required');
      return;
    }
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (): void => {
    // Validation
    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }
    if (!formData.description.trim()) {
      alert('Product description is required');
      return;
    }
    
    // ✅ ตรวจสอบรูปภาพ - บังคับสำหรับสินค้าใหม่
    if (!editingProduct && !imageFile) {
      alert('Product image is required');
      return;
    }
    
    if (formData.variants.length === 0) {
      alert('At least one variant is required');
      return;
    }

    // Validate variants
    for (let i = 0; i < formData.variants.length; i++) {
      const v = formData.variants[i];
      if (!v.sku.trim()) {
        alert(`Variant ${i + 1}: SKU is required`);
        return;
      }
      if (v.price <= 0) {
        alert(`Variant ${i + 1}: Price must be greater than 0`);
        return;
      }
    }

    // Pass both formData and imageFile to parent
    onSave(formData, imageFile);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center z-10">
            <h2 className="text-xl font-bold text-white">
              {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-blue-800 text-white transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 p-6 space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-3 animate-shake">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter product description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows={3}
              />
            </div>

            {/* Image Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-blue-50">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Image size={18} />
                Product Image {!editingProduct && <span className="text-red-500">*</span>}
              </label>

              {/* Current Image (for editing) */}
              {editingProduct && imagePreview && !imageFile && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                  <img
                    src={imagePreview}
                    alt="Current product"
                    className="w-full max-w-xs rounded-lg border border-gray-300 object-cover"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Upload a new image to replace the current one
                  </p>
                </div>
              )}

              {/* File Upload */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer transition-all"
                />
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                  <Upload size={14} />
                  Supported: JPG, PNG, GIF (Max 5MB)
                </p>
              </div>

              {/* New Image Preview */}
              {imageFile && imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    ✅ New Image Preview:
                  </p>
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-xs rounded-lg border-2 border-green-400 object-cover shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(editingProduct?.imageUrl || '');
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-green-600 font-medium mt-2">
                    ✓ Image ready to upload
                  </p>
                </div>
              )}
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {Object.entries(PRODUCT_STATUS).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Variants Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-gray-800">
                  🎨 Variants <span className="text-red-500">*</span>
                </h3>
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                  {formData.variants.length}
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {formData.variants.map((variant, idx) => (
                  <VariantRow
                    key={idx}
                    variant={variant}
                    index={idx}
                    onVariantChange={handleVariantChange}
                    onRemove={handleRemoveVariant}
                    canRemove={formData.variants.length > 1}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddVariant}
                className="w-full mt-3 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add Variant
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
            >
              {isLoading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isLoading
                ? 'Saving...'
                : editingProduct
                  ? 'Update Product'
                  : 'Create Product'}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(2rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-0.5rem); }
          75% { transform: translateX(0.5rem); }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-in-out; }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </>
  );
}

// VariantRow Component
interface VariantRowProps {
  variant: Variant;
  index: number;
  onVariantChange: (index: number, field: keyof Variant, value: string | number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

function VariantRow({ variant, index, onVariantChange, onRemove, canRemove }: VariantRowProps) {
  const SIZES = ['S', 'SS', 'SSS', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  
  return (
    <div className="grid grid-cols-6 gap-2 items-end p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all">
      <select
        value={variant.size}
        onChange={(e) => onVariantChange(index, 'size', e.target.value)}
        className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {SIZES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      
      <input
        type="text"
        placeholder="Color"
        value={variant.color}
        onChange={(e) => onVariantChange(index, 'color', e.target.value)}
        className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      
      <input
        type="text"
        placeholder="SKU"
        value={variant.sku}
        onChange={(e) => onVariantChange(index, 'sku', e.target.value)}
        className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      
      <input
        type="number"
        placeholder="Price"
        value={variant.price}
        onChange={(e) => onVariantChange(index, 'price', e.target.value)}
        className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      
      <input
        type="number"
        placeholder="Qty"
        value={variant.quantity}
        onChange={(e) => onVariantChange(index, 'quantity', e.target.value)}
        className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        className="p-1.5 rounded-full text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}