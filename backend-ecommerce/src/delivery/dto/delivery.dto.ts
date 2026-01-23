import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';

export enum DeliveryStatus {
    PENDING = 'PENDING',
    ASSIGNED = 'ASSIGNED',
    PICKED_UP = 'PICKED_UP',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    FAILED = 'FAILED',
}

export class CreateDeliveryDto {
    @IsString()
    orderId: string;

    @IsOptional()
    @IsString()
    driverName?: string;

    @IsOptional()
    @IsString()
    driverPhone?: string;

    @IsOptional()
    @IsString()
    vehicleInfo?: string;

    @IsOptional()
    @IsDateString()
    estimatedTime?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}

export class UpdateDeliveryDto {
    @IsOptional()
    @IsEnum(DeliveryStatus)
    status?: DeliveryStatus;

    @IsOptional()
    @IsString()
    driverName?: string;

    @IsOptional()
    @IsString()
    driverPhone?: string;

    @IsOptional()
    @IsString()
    vehicleInfo?: string;

    @IsOptional()
    @IsDateString()
    estimatedTime?: string;

    @IsOptional()
    @IsDateString()
    actualDelivery?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
