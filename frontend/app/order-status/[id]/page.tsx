'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function OrderStatusPage() {
    const params = useParams();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [review, setReview] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Poll for status every 5 seconds (Simple implementation)
        const fetchOrder = () => {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${params.id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Order not found');
                    return res.json();
                })
                .then(data => {
                    setOrder(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        };

        fetchOrder();
        const interval = setInterval(fetchOrder, 5000);
        return () => clearInterval(interval);

    }, [params.id]);


    const handleSubmitReview = async () => {
        if (!email || !review) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: params.id,
                    email,
                    rating: 5,
                    comment: review
                })
            });
            if (res.ok) {
                setSubmitted(true);
                toast.success('Review submitted! 5% Discount applied at counter.');
            }
        } catch (e) {
            toast.error('Failed to submit review');
        }
    };

    if (loading) return <div className="p-8 text-center bg-gray-50 min-h-screen">Loading status...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-md mx-auto space-y-6">
                <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900">Order Sent!</h1>
                    <p className="text-gray-600">Your food is being prepared.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex justify-between">
                            <span>Order #{String(params.id).slice(-4)}</span>
                            <Badge>{order.status}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500">
                            Please pay at the counter after you finish dining.
                        </p>
                    </CardContent>
                </Card>

                {/* Review Section */}
                {!submitted ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Get 5% Off</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Leave your email and a quick review to get a discount on this meal!
                            </p>
                            <Input
                                placeholder="Result@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <Input
                                placeholder="How was the food?"
                                value={review}
                                onChange={e => setReview(e.target.value)}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleSubmitReview} className="w-full">
                                Submit & Get Discount
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-6 text-center">
                            <h3 className="text-lg font-bold text-green-800">Discount Unlocked! 🎁</h3>
                            <p className="text-green-700">Mention your email at the counter for 5% off.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
