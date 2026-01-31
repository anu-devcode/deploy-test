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
            <div className="aspect-square bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100">
                <span className="text-6xl grayscale opacity-20">📦</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-3xl border border-slate-100 overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-500">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50/50 to-white">
                    <img
                        src={selectedImage}
                        alt={productName}
                        className="max-w-[85%] max-h-[85%] object-contain hover:scale-105 transition-transform duration-700"
                    />
                </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`w-20 h-20 flex-shrink-0 rounded-2xl border transition-all duration-300 overflow-hidden ${selectedImage === image
                                ? 'border-emerald-500 bg-emerald-50/30'
                                : 'border-slate-100 bg-white hover:border-slate-300'
                            }`}
                    >
                        <div className="w-full h-full flex items-center justify-center p-2">
                            <img
                                src={image}
                                alt={`${productName} view ${index + 1}`}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
