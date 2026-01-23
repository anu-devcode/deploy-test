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
exports.StorefrontController = void 0;
const common_1 = require("@nestjs/common");
const storefront_service_1 = require("./storefront.service");
const decorators_1 = require("../common/decorators");
let StorefrontController = class StorefrontController {
    storefrontService;
    constructor(storefrontService) {
        this.storefrontService = storefrontService;
    }
    getProducts(tenantId, categoryId, search, tags, featured, page, limit, sortBy, sortOrder) {
        return this.storefrontService.getProducts(tenantId, {
            categoryId,
            search,
            tags: tags ? tags.split(',') : undefined,
            featured: featured === 'true',
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
            sortBy,
            sortOrder,
        });
    }
    getProduct(id, tenantId) {
        return this.storefrontService.getProduct(id, tenantId);
    }
    getFeaturedProducts(tenantId, limit) {
        return this.storefrontService.getFeaturedProducts(tenantId, limit ? parseInt(limit) : 8);
    }
    getCategories(tenantId) {
        return this.storefrontService.getCategories(tenantId);
    }
    getProductSuggestions(id, tenantId, limit) {
        return this.storefrontService.getProductSuggestions(id, tenantId, limit ? parseInt(limit) : 4);
    }
    getCmsPage(slug, tenantId) {
        return this.storefrontService.getCmsPage(slug, tenantId);
    }
    getTenantConfig(slug) {
        return this.storefrontService.getTenantConfig(slug);
    }
};
exports.StorefrontController = StorefrontController;
__decorate([
    (0, common_1.Get)('products'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Query)('categoryId')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('tags')),
    __param(4, (0, common_1.Query)('featured')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('limit')),
    __param(7, (0, common_1.Query)('sortBy')),
    __param(8, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Get)('featured'),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "getFeaturedProducts", null);
__decorate([
    (0, common_1.Get)('categories'),
    __param(0, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('products/:id/suggestions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.TenantId)()),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "getProductSuggestions", null);
__decorate([
    (0, common_1.Get)('pages/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "getCmsPage", null);
__decorate([
    (0, common_1.Get)('config/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "getTenantConfig", null);
exports.StorefrontController = StorefrontController = __decorate([
    (0, common_1.Controller)('storefront'),
    __metadata("design:paramtypes", [storefront_service_1.StorefrontService])
], StorefrontController);
//# sourceMappingURL=storefront.controller.js.map