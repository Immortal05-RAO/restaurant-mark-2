'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Order {
    _id: string;
    tableId: string;
    items: any[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

export default function AdminDashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
            // In real app, add Authorization header if protected
            // headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => res.json())
            .then((data) => setOrders(data))
            .catch((err) => toast.error('Failed to load orders'));

        // Poll every 10s
        const interval = setInterval(() => {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`)
                .then((res) => res.json())
                .then((data) => setOrders(data));
        }, 10000);
        return () => clearInterval(interval);
    }, [router]);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                toast.success(`Order status updated to ${status}`);
                setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
            }
        } catch (e) {
            toast.error('Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500';
            case 'PREPARING': return 'bg-blue-500';
            case 'SERVED': return 'bg-green-500';
            case 'COMPLETED': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>
                <Button variant="outline" onClick={() => router.push('/admin/login')}>Logout</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                    <Card key={order._id}>
                        <CardHeader className="flex flex-row justify-between items-center pb-2">
                            <CardTitle className="text-lg">Table {order.tableId}</CardTitle>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm mb-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="border-t pt-2 font-bold flex justify-between">
                                    <span>Total</span>
                                    <span>${order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Button size="sm" variant="outline" onClick={() => updateStatus(order._id, 'PREPARING')}>
                                    Preparing
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => updateStatus(order._id, 'SERVED')}>
                                    Served
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => updateStatus(order._id, 'COMPLETED')}>
                                    Completed
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => updateStatus(order._id, 'CANCELLED')}>
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
