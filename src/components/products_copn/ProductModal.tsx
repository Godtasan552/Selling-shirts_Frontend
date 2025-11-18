import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

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
  onSave: (data: FormDataType) => void;
}

const CATEGORIES = ['t-shirt', 'polo', 'hoodie', 'jacket', 'other'];
const SIZES = ['S', 'SS', 'SSS', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', '9XL', '10XL'];

// ทดสอบภาษาไทย
const TEST_THAI = 'สีแดง';
const THAI_COLORS = ['แดง', 'เขียว', 'น้ำเงิน', 'ดำ', 'ขาว'];
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

// ฟังก์ชันสร้าง SKU อัตโนมัติ
function generateSKU(category: string, size: string, color: string, allVariants: Variant[], currentIndex: number): string {
  // หากยังไม่มีสี ให้ส่งคืน SKU ที่ว่าง
  if (!color.trim()) {
    return '';
  }

  // สร้าง SKU โดยใช้ตัวอักษรเต็มจาก category, size, color
  const baseSKU = `${category.toUpperCase()}-${size.toUpperCase()}-${color.toUpperCase()}`;
  
  // นับจำนวน variant ที่มี SKU เดียวกัน (ยกเว้นตัวปัจจุบัน)
  let matchingCount = 0;
  for (let i = 0; i < allVariants.length; i++) {
    if (i === currentIndex) continue;
    const v = allVariants[i];
    const variantBase = `${category.toUpperCase()}-${v.size.toUpperCase()}-${v.color.toUpperCase()}`;
    if (variantBase === baseSKU) {
      matchingCount++;
    }
  }
  
  // เพิ่มหมายเลข SKU เสมอ เพื่อให้มี uniqueness (เริ่มจาก 001)
  const number = String(currentIndex + 1).padStart(3, '0');
  return `${baseSKU}-${number}`;
}

function ProductModalForm({
  editingProduct,
  isLoading,
  error,
  onClose,
  onSave,
}: Omit<ProductModalProps, 'isOpen'>) {
  const [formData, setFormData] = useState<FormDataType>(() => {
    if (editingProduct) {
      return {
        name: editingProduct.name,
        description: editingProduct.description,
        category: editingProduct.category,
        status: editingProduct.status,
        variants: editingProduct.variants,
      };
    }
    return initialFormData;
  });

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string | number
  ): void => {
    const newVariants = [...formData.variants];
    const updatedVariant = {
      ...newVariants[index],
      [field]: field === 'price' || field === 'quantity' ? Number(value) : value,
    };

    // อัปเดต SKU อัตโนมัติเมื่อเปลี่ยน size หรือ color
    if (field === 'size' || field === 'color') {
      updatedVariant.sku = generateSKU(
        formData.category,
        updatedVariant.size,
        updatedVariant.color,
        newVariants,
        index
      );
    }

    newVariants[index] = updatedVariant;
    
    // อัปเดต SKU ของ variant อื่นๆ ที่อาจได้รับผลกระทบ
    const updatedAllVariants = newVariants.map((v, idx) => {
      if (idx === index) return v;
      return {
        ...v,
        sku: generateSKU(formData.category, v.size, v.color, newVariants, idx)
      };
    });

    setFormData({ ...formData, variants: updatedAllVariants });
  };

  const handleCategoryChange = (newCategory: string): void => {
    const newVariants = formData.variants.map((v, idx) => ({
      ...v,
      sku: generateSKU(newCategory, v.size, v.color, formData.variants, idx)
    }));
    setFormData({ ...formData, category: newCategory, variants: newVariants });
  };

  const handleAddVariant = (): void => {
    const newVariant: Variant = { size: 'M', color: '', sku: '', price: 0, quantity: 0 };
    const newVariants = [...formData.variants, newVariant];
    setFormData({
      ...formData,
      variants: newVariants,
    });
  };

  const handleRemoveVariant = (index: number): void => {
    if (formData.variants.length === 1) {
      alert('At least one variant is required');
      return;
    }
    const newVariants = formData.variants.filter((_, i) => i !== index);
    
    // อัปเดต SKU หลังลบ variant
    const updatedVariants = newVariants.map((v, idx) => ({
      ...v,
      sku: generateSKU(formData.category, v.size, v.color, newVariants, idx)
    }));
    
    setFormData({
      ...formData,
      variants: updatedVariants,
    });
  };

  const handleSubmit = (): void => {
    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }
    if (!formData.description.trim()) {
      alert('Product description is required');
      return;
    }
    
    if (formData.variants.length === 0) {
      alert('At least one variant is required');
      return;
    }

    for (let i = 0; i < formData.variants.length; i++) {
      const v = formData.variants[i];
      if (!v.sku.trim()) {
        alert(`Variant ${i + 1}: SKU cannot be empty (please enter color)`);
        return;
      }
      if (v.price <= 0) {
        alert(`Variant ${i + 1}: Price must be greater than 0`);
        return;
      }
      if (v.quantity < 0) {
        alert(`Variant ${i + 1}: Quantity cannot be negative`);
        return;
      }
    }

    onSave(formData);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
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

      <div className="overflow-y-auto flex-1 p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-3 animate-shake">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter product description"
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {Object.entries(PRODUCT_STATUS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
        </div>

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
                disabled={isLoading}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddVariant}
            disabled={isLoading}
            className="w-full mt-3 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            Add Variant
          </button>
        </div>
      </div>

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
  );
}

export function ProductModal({
  isOpen,
  isLoading,
  error,
  editingProduct,
  onClose,
  onSave,
}: ProductModalProps) {
  if (!isOpen) return null;

  const modalKey = editingProduct?._id || 'new';

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <ProductModalForm
          key={modalKey}
          editingProduct={editingProduct}
          isLoading={isLoading}
          error={error}
          onClose={onClose}
          onSave={onSave}
        />
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

interface VariantRowProps {
  variant: Variant;
  index: number;
  onVariantChange: (index: number, field: keyof Variant, value: string | number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  disabled?: boolean;
}

function VariantRow({ 
  variant, 
  index, 
  onVariantChange, 
  onRemove, 
  canRemove,
  disabled = false
}: VariantRowProps) {
  return (
    <div className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all">
      <div className="grid grid-cols-6 gap-2">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Size</label>
          <select
            value={variant.size}
            onChange={(e) => onVariantChange(index, 'size', e.target.value)}
            disabled={disabled}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Color</label>
          <input
            type="text"
            placeholder="Color"
            value={variant.color}
            onChange={(e) => onVariantChange(index, 'color', e.target.value)}
            disabled={disabled}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">SKU (Auto)</label>
          <input
            type="text"
            placeholder="Auto generated"
            value={variant.sku}
            disabled
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded bg-gray-100 text-gray-600 cursor-not-allowed font-mono text-xs"
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Price</label>
          <input
            type="number"
            placeholder="Price"
            value={variant.price}
            onChange={(e) => onVariantChange(index, 'price', e.target.value)}
            disabled={disabled}
            min="0"
            step="0.01"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            placeholder="Qty"
            value={variant.quantity}
            onChange={(e) => onVariantChange(index, 'quantity', e.target.value)}
            disabled={disabled}
            min="0"
            step="1"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => onRemove(index)}
            disabled={!canRemove || disabled}
            className="w-full p-1.5 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Trash2 size={16} className="mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;