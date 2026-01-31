import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateCustomerDto {
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsString()
    adminNotes?: string;

    @IsOptional()
    @IsString({ each: true })
    flags?: string[];
}

export class UpdateCustomerDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsString()
    adminNotes?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString({ each: true })
    flags?: string[];
}

export class CreateAddressDto {
    @IsNotEmpty()
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    label?: string;

    @IsNotEmpty()
    @IsString()
    street: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}

export class UpdateAddressDto {
    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    label?: string;

    @IsOptional()
    @IsString()
    street?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}
