'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
    available: boolean;
}

const CATEGORIES = ['All', 'Starter', 'Main', 'Sides', 'Drinks', 'Dessert'];

export default function MenuPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { addToCart, totalAmount, cart, tableId } = useCart();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu`)
            .then((res) => res.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch menu', err);
                setLoading(false);
                toast.error('Failed to load menu');
            });
    }, []);

    const filteredItems = selectedCategory === 'All'
        ? items
        : items.filter((item) => item.category === selectedCategory);

    const handleAddToCart = (item: MenuItem) => {
        addToCart({
            id: item._id,
            name: item.name,
            price: item.price,
            quantity: 1,
        });
        toast.success(`Added ${item.name} to cart`);
    };

    if (loading) return <div className="p-8 text-center">Loading menu...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Menu</h1>
                    {tableId && <Badge variant="outline">Table {tableId}</Badge>}
                </div>

                {/* Categories (Scrollable) */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {CATEGORIES.map((cat) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(cat)}
                            className="whitespace-nowrap"
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                    <Card key={item._id} className="overflow-hidden">
                        {item.imageUrl && (
                            <div className="h-40 bg-gray-200 relative">
                                {/* Image placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    Image: {item.name}
                                </div>
                            </div>
                        )}
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                <span className="font-semibold">${item.price.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0">
                            <Button
                                onClick={() => handleAddToCart(item)}
                                className="w-full"
                                disabled={!item.available}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                {item.available ? 'Add' : 'Unavailable'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* View Cart Floating Button */}
            {cart.length > 0 && (
                <div className="fixed bottom-4 left-4 right-4 z-50">
                    <Link href="/cart">
                        <Button className="w-full h-14 text-lg shadow-lg flex justify-between items-center px-6">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                <span>{cart.reduce((a, b) => a + b.quantity, 0)} items</span>
                            </div>
                            <span className="font-bold">${totalAmount.toFixed(2)}</span>
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
