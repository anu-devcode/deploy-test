import { IsString, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';

export class CreateCancellationRequestDto {
    @IsString()
    @IsNotEmpty()
    orderId: string;

    @IsString()
    @MinLength(10, { message: 'Reason must be at least 10 characters long' })
    reason: string;
}

export class ReviewCancellationRequestDto {
    @IsEnum(['APPROVED', 'REJECTED'])
    decision: 'APPROVED' | 'REJECTED';

    @IsString()
    @IsOptional()
    feedback?: string;
}
