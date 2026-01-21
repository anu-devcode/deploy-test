"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseController = void 0;
const common_1 = require("@nestjs/common");
const warehouse_service_1 = require("./warehouse.service");
const dto_1 = require("./dto");
const decorators_1 = require("../common/decorators");
const passport_1 = require("@nestjs/passport");
let WarehouseController = class WarehouseController {
    warehouseService;
    constructor(warehouseService) {
        this.warehouseService = warehouseService;
    }
    create(dto, tenantId) {
        return this.warehouseService.create(dto, tenantId);
    }
    findAll(tenantId) {
        return this.warehouseService.findAll(tenantId);
    }
    getInventorySummary(tenantId) {
        return this.warehouseService.getInventorySummary(tenantId);
    }
    findOne(id, tenantId) {
        return this.warehouseService.findOne(id, tenantId);
    }
    update(id, dto, tenantId) {
        return this.warehouseService.update(id, dto, tenantId);
    }
    remove(id, tenantId) {
        return this.warehouseService.remove(id, tenantId);
    }
    adjustStock(id, dto, tenantId) {
        return this.warehouseService.adjustStock(id, dto, tenantId);
    }
    getMovements(id, tenantId) {
        return this.warehouseService.getStockMovements(id, tenantId);
    }
};
exports.WarehouseController = WarehouseController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateWarehouseDto, String]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "getInventorySummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateWarehouseDto, String]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/adjust'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.StockAdjustmentDto, String]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "adjustStock", null);
__decorate([
    (0, common_1.Get)(':id/movements'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "getMovements", null);
exports.WarehouseController = WarehouseController = __decorate([
    (0, common_1.Controller)('warehouses'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [warehouse_service_1.WarehouseService])
], WarehouseController);
//# sourceMappingURL=warehouse.controller.js.map