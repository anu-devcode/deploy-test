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
exports.AdminReviewsController = void 0;
const common_1 = require("@nestjs/common");
const reviews_service_1 = require("./reviews.service");
const decorators_1 = require("../common/decorators");
const passport_1 = require("@nestjs/passport");
let AdminReviewsController = class AdminReviewsController {
    reviewsService;
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    getAllReviews(tenantId, status) {
        return this.reviewsService.getAllReviewsAdmin(tenantId, status);
    }
    getPendingReviews(tenantId) {
        return this.reviewsService.getPendingReviews(tenantId);
    }
    moderateReview(id, status, tenantId) {
        return this.reviewsService.moderateReview(id, status, tenantId);
    }
    deleteReview(id, tenantId) {
        return this.reviewsService.adminDeleteReview(id, tenantId);
    }
};
exports.AdminReviewsController = AdminReviewsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.TenantId)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminReviewsController.prototype, "getAllReviews", null);
__decorate([
    (0, common_1.Get)('pending'),
    __param(0, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminReviewsController.prototype, "getPendingReviews", null);
__decorate([
    (0, common_1.Patch)(':id/moderate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminReviewsController.prototype, "moderateReview", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminReviewsController.prototype, "deleteReview", null);
exports.AdminReviewsController = AdminReviewsController = __decorate([
    (0, common_1.Controller)('admin/reviews'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], AdminReviewsController);
//# sourceMappingURL=admin-reviews.controller.js.map