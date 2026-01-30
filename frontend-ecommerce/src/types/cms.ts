export type ContentPage = {
    id: string;
    title: string;
    slug: string;
    content: string;
    subtitle?: string;
    isPublished: boolean;
    updatedAt: string;
};

export type BlogPost = {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    author: string;
    category: string;
    coverImage?: string;
    isPublished: boolean;
    publishedAt?: string;
    updatedAt: string;
};

export type ContentBlockType = 'BANNER' | 'TESTIMONIAL' | 'FAQ' | 'STORY';

export type ContentBlock = {
    id: string;
    type: ContentBlockType;
    title: string;
    content: any; // Flexible JSON for structured data
    isActive: boolean;
    order: number;
};
