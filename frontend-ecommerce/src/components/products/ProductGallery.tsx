'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0] || '/placeholder.png');

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center">
                <span className="text-6xl">📦</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden relative">
                {/* Fallback to emoji if URL is invalid (for demo) or use Next/Image */}
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    {/* Simplified for now, assuming external URLs need configuration or are placeholders */}
                    <img
                        src={selectedImage}
                        alt={productName}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`aspect-square rounded-xl border-2 overflow-hidden ${selectedImage === image ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200 hover:border-emerald-300'
                            }`}
                    >
                        <img
                            src={image}
                            alt={`${productName} view ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
