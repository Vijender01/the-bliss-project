import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [itemCount, setItemCount] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Recalculate derived state
    const recalculate = useCallback((cartItems) => {
        const newTotal = cartItems.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0);
        const newCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
        setTotal(newTotal);
        setItemCount(newCount);
    }, []);

    // Fetch full cart from backend
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setItems([]);
            setTotal(0);
            setItemCount(0);
            return;
        }
        setLoading(true);
        try {
            const res = await cartAPI.get();
            setItems(res.data.items);
            recalculate(res.data.items);
        } catch (err) {
            console.error('Fetch cart error:', err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, recalculate]);

    // Load cart on auth change
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Add to cart with optimistic update
    const addToCart = useCallback(async (menuItem, quantity = 1) => {
        if (!isAuthenticated) return false;

        // Optimistic update
        setItems(prev => {
            const existing = prev.find(ci => ci.menuItemId === menuItem.id);
            let updated;
            if (existing) {
                updated = prev.map(ci =>
                    ci.menuItemId === menuItem.id
                        ? { ...ci, quantity: ci.quantity + quantity }
                        : ci
                );
            } else {
                updated = [...prev, {
                    id: Date.now(), // temp id
                    userId: 0,
                    menuItemId: menuItem.id,
                    quantity,
                    menuItem,
                }];
            }
            recalculate(updated);
            return updated;
        });

        // Open drawer
        setDrawerOpen(true);

        // Sync with backend in background
        try {
            await cartAPI.add({ menuItemId: menuItem.id, quantity });
            // Silently refresh to get real IDs
            const res = await cartAPI.get();
            setItems(res.data.items);
            recalculate(res.data.items);
            return true;
        } catch (err) {
            console.error('Add to cart error:', err);
            // Rollback on failure
            fetchCart();
            return false;
        }
    }, [isAuthenticated, recalculate, fetchCart]);

    // Update quantity
    const updateQuantity = useCallback(async (menuItemId, newQuantity) => {
        // Optimistic
        if (newQuantity < 1) {
            setItems(prev => {
                const updated = prev.filter(ci => ci.menuItemId !== menuItemId);
                recalculate(updated);
                return updated;
            });
        } else {
            setItems(prev => {
                const updated = prev.map(ci =>
                    ci.menuItemId === menuItemId ? { ...ci, quantity: newQuantity } : ci
                );
                recalculate(updated);
                return updated;
            });
        }

        try {
            if (newQuantity < 1) {
                await cartAPI.remove(menuItemId);
            } else {
                await cartAPI.update(menuItemId, { quantity: newQuantity });
            }
        } catch (err) {
            console.error('Update cart error:', err);
            fetchCart();
        }
    }, [recalculate, fetchCart]);

    // Remove item
    const removeItem = useCallback(async (menuItemId) => {
        setItems(prev => {
            const updated = prev.filter(ci => ci.menuItemId !== menuItemId);
            recalculate(updated);
            return updated;
        });

        try {
            await cartAPI.remove(menuItemId);
        } catch (err) {
            fetchCart();
        }
    }, [recalculate, fetchCart]);

    // Clear cart
    const clearCart = useCallback(async () => {
        const wasEmpty = items.length === 0;
        setItems([]);
        setTotal(0);
        setItemCount(0);

        if (!wasEmpty) {
            try {
                await cartAPI.clear();
            } catch (err) {
                console.warn('Clear cart API error (may have been cleared by order):', err.message);
                fetchCart();
            }
        }
    }, [items.length, fetchCart]);

    const openDrawer = useCallback(() => setDrawerOpen(true), []);
    const closeDrawer = useCallback(() => setDrawerOpen(false), []);

    return (
        <CartContext.Provider value={{
            items,
            total,
            itemCount,
            loading,
            drawerOpen,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
            fetchCart,
            openDrawer,
            closeDrawer,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}
