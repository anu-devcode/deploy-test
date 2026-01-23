export declare class CreateCmsPageDto {
    title: string;
    slug: string;
    content: Record<string, any>;
    published?: boolean;
}
export declare class UpdateCmsPageDto {
    title?: string;
    content?: Record<string, any>;
    published?: boolean;
}
