import { useState, useEffect } from 'react';

export default function MenuItemDialog({ isOpen, item, onSave, onClose }) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category: 'BREAKFAST',
    });
    const [saving, setSaving] = useState(false);

    const isEdit = !!item;

    useEffect(() => {
        if (item) {
            setForm({
                name: item.name || '',
                description: item.description || '',
                price: item.price?.toString() || '',
                image: item.image || '',
                category: item.category || 'BREAKFAST',
            });
        } else {
            setForm({ name: '', description: '', price: '', image: '', category: 'BREAKFAST' });
        }
    }, [item, isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.description || !form.price) return;

        setSaving(true);
        try {
            await onSave({
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                image: form.image || null,
                category: form.category,
            });
            onClose();
        } catch (err) {
            console.error('Save failed:', err);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

            {/* Dialog */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {isEdit ? '✏️ Update Item' : '➕ Add New Item'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Item Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Paneer Parantha"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-800"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the dish..."
                            required
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-800 resize-none"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="e.g. 80"
                            required
                            min="1"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-800"
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Image (emoji or URL)
                        </label>
                        <input
                            type="text"
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            placeholder="🍛 or https://example.com/image.jpg"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-800"
                        />
                        {form.image && (
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-sm text-gray-500">Preview:</span>
                                {form.image.startsWith('http') ? (
                                    <img src={form.image} alt="preview" className="w-10 h-10 rounded object-cover" />
                                ) : (
                                    <span className="text-3xl">{form.image}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-800 bg-white"
                        >
                            <option value="BREAKFAST">🌅 Breakfast (9 AM – 10 AM)</option>
                            <option value="LUNCH">☀️ Lunch (12:30 PM – 1:30 PM)</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                isEdit ? 'Save Changes' : 'Add Item'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
