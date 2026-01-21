'use client';

import { useState } from 'react';
import { useCart } from '@/context';

interface AddToCartButtonProps {
    productId: string;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
    const { addToCart, loading } = useCart();
    const [adding, setAdding] = useState(false);

    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if inside a link
        e.stopPropagation();

        setAdding(true);
        await addToCart(productId, 1);
        setAdding(false);
    };

    return (
        <button
            onClick={handleAdd}
            disabled={adding || loading}
            className="w-full mt-4 bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {adding ? (
                <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Adding...</span>
                </>
            ) : (
                <>
                    <span>🛒</span>
                    <span>Add to Cart</span>
                </>
            )}
        </button>
    );
}
