'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string; // menu item id
    name: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    totalAmount: number;
    tableId: string | null;
    setTableId: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [tableId, setTableId] = useState<string | null>(null);

    // Persist cart to local storage (optional but good for reload)
    useEffect(() => {
        const savedCart = localStorage.getItem('restaurant-cart');
        if (savedCart) setCart(JSON.parse(savedCart));
        const savedTable = localStorage.getItem('restaurant-table-id');
        if (savedTable) setTableId(savedTable);
    }, []);

    useEffect(() => {
        localStorage.setItem('restaurant-cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (tableId) localStorage.setItem('restaurant-table-id', tableId);
    }, [tableId]);

    const addToCart = (item: CartItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart((prev) => prev.filter((i) => i.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        setCart((prev) =>
            prev.map((i) => (i.id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i))
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalAmount,
                tableId,
                setTableId,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
