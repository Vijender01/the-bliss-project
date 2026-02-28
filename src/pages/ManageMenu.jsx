import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { kitchenMenuAPI } from '../services/api';
import MenuItemDialog from '../components/MenuItemDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import LimitedQuantityDialog from '../components/LimitedQuantityDialog';

export default function ManageMenu() {
    const { role } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Admin kitchen selector
    const [kitchens, setKitchens] = useState([]);
    const [selectedKitchenId, setSelectedKitchenId] = useState('');

    // Dialogs
    const [showAddEdit, setShowAddEdit] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showOutOfStock, setShowOutOfStock] = useState(false);
    const [outOfStockTarget, setOutOfStockTarget] = useState(null);
    const [showLimited, setShowLimited] = useState(false);
    const [limitedTarget, setLimitedTarget] = useState(null);

    // Load kitchens for admin
    useEffect(() => {
        if (role === 'ADMIN') {
            loadKitchens();
        }
    }, [role]);

    // Load menu items
    useEffect(() => {
        if (role === 'KITCHEN_OWNER') {
            loadMenu();
        } else if (role === 'ADMIN' && selectedKitchenId) {
            loadMenu(selectedKitchenId);
        }
    }, [role, selectedKitchenId]);

    const loadKitchens = async () => {
        try {
            const res = await kitchenMenuAPI.listKitchens();
            setKitchens(res.data);
            if (res.data.length > 0) {
                setSelectedKitchenId(res.data[0].id.toString());
            }
        } catch (err) {
            showMsg('Failed to load kitchens', 'error');
        }
    };

    const loadMenu = async (kitchenId) => {
        setLoading(true);
        try {
            const res = await kitchenMenuAPI.getMenu(kitchenId || null);
            setItems(res.data);
        } catch (err) {
            showMsg('Failed to load menu items', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    // Add item
    const handleAddItem = () => {
        setEditItem(null);
        setShowAddEdit(true);
    };

    // Edit item
    const handleEditItem = (item) => {
        setEditItem(item);
        setShowAddEdit(true);
    };

    // Save (add or update)
    const handleSaveItem = async (formData) => {
        if (editItem) {
            await kitchenMenuAPI.updateItem(editItem.id, formData);
            showMsg('✓ Item updated successfully');
        } else {
            const payload = { ...formData };
            if (role === 'ADMIN' && selectedKitchenId) {
                payload.kitchenId = parseInt(selectedKitchenId);
            }
            await kitchenMenuAPI.addItem(payload);
            showMsg('✓ Item added successfully');
        }
        loadMenu(role === 'ADMIN' ? selectedKitchenId : null);
    };

    // Delete item
    const handleDeleteClick = (item) => {
        setDeleteTarget(item);
        setShowDelete(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await kitchenMenuAPI.deleteItem(deleteTarget.id);
            showMsg('✓ Item deleted successfully');
            loadMenu(role === 'ADMIN' ? selectedKitchenId : null);
        } catch (err) {
            showMsg('Failed to delete item', 'error');
        } finally {
            setShowDelete(false);
            setDeleteTarget(null);
        }
    };

    // Out of Stock
    const handleOutOfStockClick = (item) => {
        setOutOfStockTarget(item);
        setShowOutOfStock(true);
    };

    const handleConfirmOutOfStock = async () => {
        if (!outOfStockTarget) return;
        try {
            const newVal = !outOfStockTarget.isOutOfStock;
            await kitchenMenuAPI.toggleOutOfStock(outOfStockTarget.id, newVal);
            showMsg(newVal ? '✓ Marked out of stock' : '✓ Marked back in stock');
            loadMenu(role === 'ADMIN' ? selectedKitchenId : null);
        } catch (err) {
            showMsg('Failed to update stock status', 'error');
        } finally {
            setShowOutOfStock(false);
            setOutOfStockTarget(null);
        }
    };

    // Limited Quantity
    const handleLimitedClick = (item) => {
        setLimitedTarget(item);
        setShowLimited(true);
    };

    const handleSaveLimited = async (data) => {
        if (!limitedTarget) return;
        await kitchenMenuAPI.setLimited(limitedTarget.id, data);
        showMsg('✓ Limited quantity updated');
        loadMenu(role === 'ADMIN' ? selectedKitchenId : null);
    };

    // Status badge
    const getStatusBadge = (item) => {
        if (item.isOutOfStock) {
            return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">🚫 Out of Stock</span>;
        }
        if (item.isLimited) {
            return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">⚠️ Limited{item.limitedQuantity != null ? ` (${item.limitedQuantity})` : ''}</span>;
        }
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">✅ Active</span>;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">🍽️ Manage Menu</h1>
                    <p className="text-gray-500 mt-1">
                        {role === 'ADMIN' ? 'Manage menu items for any kitchen' : 'Manage your kitchen\'s menu items'}
                    </p>
                </div>
                <button
                    onClick={handleAddItem}
                    disabled={role === 'ADMIN' && !selectedKitchenId}
                    className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-orange-200 hover:shadow-orange-300"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Item
                </button>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`p-4 rounded-xl mb-6 font-medium transition-all ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Admin Kitchen Selector */}
            {role === 'ADMIN' && (
                <div className="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Kitchen</label>
                    <select
                        value={selectedKitchenId}
                        onChange={(e) => setSelectedKitchenId(e.target.value)}
                        className="w-full sm:w-80 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-gray-800 bg-white"
                    >
                        <option value="">— Select a kitchen —</option>
                        {kitchens.map((k) => (
                            <option key={k.id} value={k.id}>
                                {k.name} {k.owner ? `(${k.owner.name})` : ''} — {k._count.menuItems} items
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
                    <p className="text-gray-500 mt-4">Loading menu items...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-6xl block mb-4">🍽️</span>
                    <p className="text-xl font-semibold text-gray-700">No menu items yet</p>
                    <p className="text-gray-500 mt-2">Click "Add Item" to start building your menu</p>
                </div>
            ) : (
                /* Menu Items List */
                <div className="space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all ${item.isOutOfStock ? 'opacity-60' : ''
                                }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* Image */}
                                <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center text-3xl">
                                    {item.image?.startsWith('http') ? (
                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                                    ) : (
                                        item.image || '🍽️'
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                        {getStatusBadge(item)}
                                    </div>
                                    <p className="text-gray-500 text-sm mt-1 line-clamp-1">{item.description}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-xl font-bold text-orange-600">₹{item.price}</span>
                                        {item.kitchen && (
                                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{item.kitchen.name}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleEditItem(item)}
                                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-sm rounded-lg transition-colors"
                                    >
                                        ✏️ Update
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(item)}
                                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm rounded-lg transition-colors"
                                    >
                                        🗑️ Delete
                                    </button>
                                    <button
                                        onClick={() => handleOutOfStockClick(item)}
                                        className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${item.isOutOfStock
                                                ? 'bg-green-50 hover:bg-green-100 text-green-700'
                                                : 'bg-red-50 hover:bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {item.isOutOfStock ? '📦 Restock' : '🚫 Out of Stock'}
                                    </button>
                                    <button
                                        onClick={() => handleLimitedClick(item)}
                                        className="px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-semibold text-sm rounded-lg transition-colors"
                                    >
                                        ⚠️ Limited
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Dialogs */}
            <MenuItemDialog
                isOpen={showAddEdit}
                item={editItem}
                onSave={handleSaveItem}
                onClose={() => { setShowAddEdit(false); setEditItem(null); }}
            />

            <ConfirmDialog
                isOpen={showDelete}
                title="Delete Item"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() => { setShowDelete(false); setDeleteTarget(null); }}
            />

            <ConfirmDialog
                isOpen={showOutOfStock}
                title={outOfStockTarget?.isOutOfStock ? 'Restock Item' : 'Mark Out of Stock'}
                message={outOfStockTarget?.isOutOfStock
                    ? `Mark "${outOfStockTarget?.name}" as back in stock? It will be visible to customers again.`
                    : `Mark "${outOfStockTarget?.name}" as out of stock? It will be hidden from customers.`
                }
                confirmLabel={outOfStockTarget?.isOutOfStock ? 'Restock' : 'Mark Out of Stock'}
                variant={outOfStockTarget?.isOutOfStock ? 'primary' : 'danger'}
                onConfirm={handleConfirmOutOfStock}
                onCancel={() => { setShowOutOfStock(false); setOutOfStockTarget(null); }}
            />

            <LimitedQuantityDialog
                isOpen={showLimited}
                item={limitedTarget}
                onSave={handleSaveLimited}
                onClose={() => { setShowLimited(false); setLimitedTarget(null); }}
            />
        </div>
    );
}
