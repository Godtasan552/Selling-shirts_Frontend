// ============================================
// components/admin/ProductModal.tsx - FIXED
// ============================================
import { useState, useEffect } from 'react';
import type { Product, FormDataType, Variant } from '@/types/product_admin';
import { CATEGORIES, SIZES, PRODUCT_STATUS } from '@/types/product_admin';

interface ProductModalProps {
    isOpen: boolean;
    isLoading: boolean;
    error: string;
    editingProduct: Product | null;
    onClose: () => void;
    onSave: (data: FormDataType) => void;
}

const initialFormData: FormDataType = {
    name: '',
    description: '',
    category: 't-shirt',
    imageUrl: '',
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
    const [formData, setFormData] = useState<FormDataType>(initialFormData);

    // Reset form when modal closes (RUN only on close)
    useEffect(() => {
        if (!isOpen) {
            // Schedule clear AFTER close render
            const timer = setTimeout(() => {
                setFormData(initialFormData);
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleVariantChange = (
        index: number,
        field: keyof Variant,
        value: string | number
    ): void => {
        const newVariants = [...formData.variants];
        newVariants[index] = {
            ...newVariants[index],
            [field]:
                field === 'price' || field === 'quantity' ? Number(value) : value,
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
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-6 z-10">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Enter product name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Product Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Enter product description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL
                        </label>
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) =>
                                setFormData({ ...formData, imageUrl: e.target.value })
                            }
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Category & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({ ...formData, category: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({ ...formData, status: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Variants *
                            </label>
                            <span className="text-xs text-gray-500">
                                {formData.variants.length} variant{formData.variants.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="space-y-2 bg-gray-50 p-3 rounded-lg max-h-56 overflow-y-auto border border-gray-200">
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
                            className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            + Add Variant
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            {isLoading
                                ? 'Saving...'
                                : editingProduct
                                    ? 'Update Product'
                                    : 'Create Product'}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// VariantRow Component
// ============================================
interface VariantRowProps {
    variant: Variant;
    index: number;
    onVariantChange: (
        index: number,
        field: keyof Variant,
        value: string | number
    ) => void;
    onRemove: (index: number) => void;
    canRemove: boolean;
}

function VariantRow({
    variant,
    index,
    onVariantChange,
    onRemove,
    canRemove,
}: VariantRowProps) {
    return (
        <div className="grid grid-cols-6 gap-2 items-end p-2 bg-white rounded border border-gray-200">
            {/* Size */}
            <select
                value={variant.size}
                onChange={(e) => onVariantChange(index, 'size', e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {SIZES.map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </select>

            {/* Color */}
            <input
                type="text"
                placeholder="Color"
                value={variant.color}
                onChange={(e) => onVariantChange(index, 'color', e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* SKU */}
            <input
                type="text"
                placeholder="SKU"
                value={variant.sku}
                onChange={(e) => onVariantChange(index, 'sku', e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Price */}
            <input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={(e) => onVariantChange(index, 'price', e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Quantity */}
            <input
                type="number"
                placeholder="Qty"
                value={variant.quantity}
                onChange={(e) => onVariantChange(index, 'quantity', e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Remove Button */}
            <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={!canRemove}
                className="text-red-600 hover:text-red-900 disabled:text-gray-400 text-sm font-medium"
            >
                Remove
            </button>
        </div>
    );
}