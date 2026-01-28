'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Loader2 } from 'lucide-react';

export default function TableEntryPage() {
    const params = useParams();
    const router = useRouter();
    const { setTableId } = useCart();

    useEffect(() => {
        if (params.id) {
            const id = Array.isArray(params.id) ? params.id[0] : params.id;
            setTableId(id);
            // Simulate a small delay for "Verifying Table..." experience
            setTimeout(() => {
                router.push('/menu');
            }, 800);
        }
    }, [params, router, setTableId]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white">
            <Loader2 className="h-10 w-10 animate-spin text-black mb-4" />
            <h2 className="text-xl font-medium text-gray-900">Connecting to Table {params.id}...</h2>
        </div>
    );
}
