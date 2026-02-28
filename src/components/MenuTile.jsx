import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import QuantitySelector from './QuantitySelector';

export default function MenuTile({ item }) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const isOutOfStock = item.isOutOfStock;
    const isLimited = item.isLimited;
    const maxQty = isLimited ? 2 : 99;

    const handleNavigate = () => {
        navigate(`/item/${item.id}`);
    };

    const handleAdd = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (isOutOfStock) return;

        setAdding(true);
        const success = await addToCart(item, quantity);
        setAdding(false);

        if (success) {
            setAdded(true);
            setQuantity(1);
            setTimeout(() => setAdded(false), 1500);
        }
    };

    return (
        <div className={`group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isOutOfStock ? 'opacity-70' : ''}`}>
            {/* Out of Stock Ribbon */}
            {isOutOfStock && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-4 -left-9 w-40 bg-red-600 text-white text-xs font-bold text-center py-1.5 transform -rotate-45 shadow-md">
                        Out of Stock
                    </div>
                    <div className="absolute inset-0 bg-gray-100/50 rounded-2xl" />
                </div>
            )}

            {/* Limited Badge */}
            {isLimited && !isOutOfStock && (
                <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900 shadow-sm animate-pulse">
                        ⚠️ Limited (Max 2)
                    </span>
                </div>
            )}

            {/* Image — Clickable */}
            <div
                onClick={handleNavigate}
                className="h-36 bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 flex items-center justify-center text-6xl cursor-pointer transition-all duration-300 group-hover:from-orange-300 group-hover:to-orange-500 relative overflow-hidden"
            >
                {item.image?.startsWith('http') ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">{item.image || '🍽️'}</span>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3
                    onClick={handleNavigate}
                    className="text-lg font-bold text-gray-800 line-clamp-1 cursor-pointer hover:text-orange-600 transition-colors"
                >
                    {item.name}
                </h3>

                <p className="text-gray-500 text-sm mt-1 line-clamp-1">{item.description}</p>

                {item.kitchen && (
                    <p className="text-xs text-gray-400 mt-1">from {item.kitchen.name}</p>
                )}

                {/* Limited stock warning */}
                {isLimited && !isOutOfStock && item.limitedQuantity != null && item.limitedQuantity <= 5 && (
                    <p className="text-xs text-red-500 font-bold mt-1">
                        🔥 Only {item.limitedQuantity} left!
                    </p>
                )}

                <div className="mt-3 mb-3">
                    <span className="text-2xl font-extrabold text-orange-600">₹{item.price}</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                    <QuantitySelector
                        value={quantity}
                        onChange={setQuantity}
                        disabled={isOutOfStock}
                        max={maxQty}
                        size="sm"
                    />

                    <button
                        onClick={handleAdd}
                        disabled={isOutOfStock || adding}
                        className={`flex-1 ml-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-1.5 ${added
                                ? 'bg-green-500 text-white scale-95'
                                : isOutOfStock
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95 shadow-md shadow-orange-200 hover:shadow-orange-300'
                            }`}
                    >
                        {adding ? (
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : added ? (
                            <>✓ Added</>
                        ) : isOutOfStock ? (
                            'Unavailable'
                        ) : (
                            <>🛒 Add</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
