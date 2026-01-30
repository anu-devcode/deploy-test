import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(dto: CreateCustomerDto, tenantId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        address: string | null;
        city: string | null;
        country: string | null;
        adminNotes: string | null;
        flags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    findAll(tenantId: string, user: any): Promise<any[]>;
    getStats(tenantId: string): Promise<{
        totalCustomers: number;
        customersThisMonth: number;
    }>;
    findOne(id: string, tenantId: string, user: any): Promise<any>;
    update(id: string, dto: UpdateCustomerDto, tenantId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        address: string | null;
        city: string | null;
        country: string | null;
        adminNotes: string | null;
        flags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
    remove(id: string, tenantId: string): Promise<{
        email: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        address: string | null;
        city: string | null;
        country: string | null;
        adminNotes: string | null;
        flags: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
    }>;
}
