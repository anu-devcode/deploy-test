import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsObject } from 'class-validator';

export class CreateCmsPageDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    slug: string;

    @IsNotEmpty()
    @IsObject()
    content: Record<string, any>;

    @IsOptional()
    @IsBoolean()
    published?: boolean;
}

export class UpdateCmsPageDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsObject()
    content?: Record<string, any>;

    @IsOptional()
    @IsBoolean()
    published?: boolean;
}
