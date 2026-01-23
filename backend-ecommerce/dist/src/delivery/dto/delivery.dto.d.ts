export declare enum DeliveryStatus {
    PENDING = "PENDING",
    ASSIGNED = "ASSIGNED",
    PICKED_UP = "PICKED_UP",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED",
    FAILED = "FAILED"
}
export declare class CreateDeliveryDto {
    orderId: string;
    driverName?: string;
    driverPhone?: string;
    vehicleInfo?: string;
    estimatedTime?: string;
    notes?: string;
}
export declare class UpdateDeliveryDto {
    status?: DeliveryStatus;
    driverName?: string;
    driverPhone?: string;
    vehicleInfo?: string;
    estimatedTime?: string;
    actualDelivery?: string;
    notes?: string;
}
