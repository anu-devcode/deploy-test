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
            <div className="aspect-square bg-white rounded-[2rem] border border-slate-100 overflow-hidden relative shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white to-slate-50/20" />
                <div className="w-full h-full flex items-center justify-center relative z-10 p-8">
                    <div key={selectedImage} className="relative w-full h-full animate-in fade-in zoom-in-95 duration-500">
                        <Image
                            src={selectedImage}
                            alt={productName}
                            fill
                            priority
                            className="object-contain hover:scale-110 transition-transform duration-700 ease-out"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`relative w-24 h-24 flex-shrink-0 rounded-2xl border transition-all duration-300 overflow-hidden snap-start ${selectedImage === image
                            ? 'border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg'
                            : 'border-slate-100 bg-white hover:border-emerald-200 opacity-60 hover:opacity-100'
                            }`}
                    >
                        <div className="w-full h-full relative p-2">
                            <Image
                                src={image}
                                alt={`${productName} view ${index + 1}`}
                                fill
                                className="object-contain"
                                sizes="96px"
                            />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
