// ============================================
// components/admin/ProductModal.tsx
// ============================================
import { useState, useEffect } from 'react';
import type { Product, FormDataType, Variant } from '@/types/product_admin';
import { CATEGORIES, SIZES, PRODUCT_STATUS } from '@/types/product_admin';
import { X, Plus, Trash2 } from 'lucide-react';

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

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
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
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div 
                    className="bg-base-100 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slide-up pointer-events-auto"
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
                            className="btn btn-ghost btn-sm btn-circle text-white hover:bg-blue-800"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto flex-1 p-6 space-y-4">
                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-error shadow-lg animate-shake">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2m-2-2l-2-2m2 2l2 2" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Product Name */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Product Name <span className="text-error">*</span></span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                placeholder="Enter product name"
                                className="input input-bordered w-full focus:input-primary transition-all"
                            />
                        </div>

                        {/* Product Description */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Description <span className="text-error">*</span></span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="Enter product description"
                                className="textarea textarea-bordered w-full focus:textarea-primary transition-all"
                                rows={3}
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Image URL</span>
                            </label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) =>
                                    setFormData({ ...formData, imageUrl: e.target.value })
                                }
                                placeholder="https://example.com/image.jpg"
                                className="input input-bordered w-full focus:input-primary transition-all"
                            />
                        </div>

                        {/* Category & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Category</span>
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                    className="select select-bordered w-full focus:select-primary transition-all"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold">Status</span>
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({ ...formData, status: e.target.value })
                                    }
                                    className="select select-bordered w-full focus:select-primary transition-all"
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
                        <div className="card bg-base-200/50 border border-base-300">
                            <div className="card-body p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-lg">
                                        🎨 Variants <span className="text-error">*</span>
                                    </h3>
                                    <span className="badge badge-lg badge-primary">
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
                                    className="btn btn-sm btn-outline btn-primary mt-3 w-full gap-2"
                                >
                                    <Plus size={16} />
                                    Add Variant
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-base-300 p-6 bg-base-100 flex gap-3">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="btn btn-primary flex-1 gap-2"
                        >
                            {isLoading && <span className="loading loading-spinner loading-sm" />}
                            {isLoading
                                ? 'Saving...'
                                : editingProduct
                                    ? 'Update Product'
                                    : 'Create Product'}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="btn btn-ghost flex-1"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(2rem);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shake {
                    0%, 100% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(-0.5rem);
                    }
                    75% {
                        transform: translateX(0.5rem);
                    }
                }

                .animate-fade-in {
                    animation: fadeIn 0.2s ease-in-out;
                }

                .animate-slide-up {
                    animation: slideUp 0.3s ease-out;
                }

                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
            `}</style>
        </>
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
        <div className="grid grid-cols-6 gap-2 items-end p-3 bg-base-100 rounded-lg border border-base-300 hover:border-primary/50 transition-all">
            {/* Size */}
            <select
                value={variant.size}
                onChange={(e) => onVariantChange(index, 'size', e.target.value)}
                className="select select-sm select-bordered focus:select-primary transition-all"
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
                className="input input-sm input-bordered focus:input-primary transition-all"
            />

            {/* SKU */}
            <input
                type="text"
                placeholder="SKU"
                value={variant.sku}
                onChange={(e) => onVariantChange(index, 'sku', e.target.value)}
                className="input input-sm input-bordered focus:input-primary transition-all"
            />

            {/* Price */}
            <input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={(e) => onVariantChange(index, 'price', e.target.value)}
                className="input input-sm input-bordered focus:input-primary transition-all"
            />

            {/* Quantity */}
            <input
                type="number"
                placeholder="Qty"
                value={variant.quantity}
                onChange={(e) => onVariantChange(index, 'quantity', e.target.value)}
                className="input input-sm input-bordered focus:input-primary transition-all"
            />

            {/* Remove Button */}
            <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={!canRemove}
                className="btn btn-sm btn-ghost btn-circle text-error hover:bg-error/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}