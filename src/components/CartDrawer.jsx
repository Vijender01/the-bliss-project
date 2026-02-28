import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import QuantitySelector from './QuantitySelector';

export default function CartDrawer() {
    const navigate = useNavigate();
    const { items, total, itemCount, drawerOpen, closeDrawer, updateQuantity, removeItem } = useCart();

    // Lock body scroll when open
    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') closeDrawer(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [closeDrawer]);

    const handleProceed = () => {
        closeDrawer();
        navigate('/cart');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeDrawer}
            />

            {/* Desktop Drawer (right slide) */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col
          ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}
          max-sm:hidden
        `}
            >
                <DrawerContent
                    items={items}
                    total={total}
                    itemCount={itemCount}
                    onClose={closeDrawer}
                    onUpdateQty={updateQuantity}
                    onRemove={removeItem}
                    onProceed={handleProceed}
                />
            </div>

            {/* Mobile Drawer (bottom slide) */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl rounded-t-3xl transform transition-transform duration-300 ease-out flex flex-col
          ${drawerOpen ? 'translate-y-0' : 'translate-y-full'}
          sm:hidden
        `}
                style={{ maxHeight: '85vh' }}
            >
                <DrawerContent
                    items={items}
                    total={total}
                    itemCount={itemCount}
                    onClose={closeDrawer}
                    onUpdateQty={updateQuantity}
                    onRemove={removeItem}
                    onProceed={handleProceed}
                    isMobile
                />
            </div>
        </>
    );
}

function DrawerContent({ items, total, itemCount, onClose, onUpdateQty, onRemove, onProceed, isMobile }) {
    return (
        <>
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0 ${isMobile ? 'pt-3' : ''}`}>
                {isMobile && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full" />
                )}
                <div className="flex items-center gap-2">
                    <span className="text-xl">🛒</span>
                    <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
                    {itemCount > 0 && (
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {itemCount}
                        </span>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
                {items.length === 0 ? (
                    <div className="text-center py-12">
                        <span className="text-5xl block mb-4">🛒</span>
                        <p className="text-gray-500 font-medium">Your cart is empty</p>
                        <p className="text-gray-400 text-sm mt-1">Add items from the menu to get started</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((ci) => (
                            <div key={ci.menuItemId} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 group/item">
                                {/* Image */}
                                <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-orange-200 to-orange-300 rounded-xl flex items-center justify-center text-2xl">
                                    {ci.menuItem.image?.startsWith('http') ? (
                                        <img src={ci.menuItem.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                                    ) : (
                                        ci.menuItem.image || '🍽️'
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-sm line-clamp-1">{ci.menuItem.name}</p>
                                    <p className="text-orange-600 font-bold text-sm">₹{ci.menuItem.price}</p>
                                </div>

                                {/* Qty + Remove */}
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    <QuantitySelector
                                        value={ci.quantity}
                                        onChange={(q) => onUpdateQty(ci.menuItemId, q)}
                                        min={0}
                                        size="sm"
                                    />
                                    <button
                                        onClick={() => onRemove(ci.menuItemId)}
                                        className="text-xs text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover/item:opacity-100"
                                    >
                                        Remove
                                    </button>
                                </div>

                                {/* Subtotal */}
                                <div className="text-right flex-shrink-0 min-w-[50px]">
                                    <p className="font-bold text-gray-800 text-sm">₹{(ci.menuItem.price * ci.quantity).toFixed(0)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
                <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">Total</span>
                        <span className="text-2xl font-extrabold text-orange-600">₹{total.toFixed(0)}</span>
                    </div>
                    <button
                        onClick={onProceed}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                    >
                        Proceed to Order
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
}
