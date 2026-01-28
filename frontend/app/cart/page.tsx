'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, totalAmount, tableId, clearCart } = useCart();
    const router = useRouter();

    const handlePlaceOrder = async () => {
        if (!tableId) {
            toast.error('Table session expired. Please rescan QR.');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tableId,
                    items: cart.map(item => ({
                        menuItemId: item.id,
                        quantity: item.quantity
                    }))
                }),
            });

            if (!response.ok) throw new Error('Failed to place order');

            const order = await response.json();
            clearCart();
            toast.success('Order placed successfully!');
            router.push(`/order-status/${order._id}`);
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again.');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
                <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
                <Link href="/menu">
                    <Button>Back to Menu</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-4">
                <Link href="/menu">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold">Your Order</h1>
            </div>

            <div className="p-4 space-y-4">
                {cart.map((item) => (
                    <Card key={item.id} className="flex flex-row items-center p-4 gap-4">
                        <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-gray-500">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                            >
                                <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-4 text-center">{item.quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                                <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500"
                                onClick={() => removeFromCart(item.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-top border-t z-50">
                <div className="flex justify-between mb-4 text-lg font-bold">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                </div>
                <Button className="w-full size-lg text-lg" onClick={handlePlaceOrder}>
                    Place Order
                </Button>
            </div>
        </div>
    );
}
