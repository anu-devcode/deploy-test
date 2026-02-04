-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'CUSTOMER';

-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "isSocialLoginEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "twoFactorBackupCodes" TEXT[],
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorMethod" TEXT,
ADD COLUMN     "twoFactorSecret" TEXT;

-- CreateTable
CREATE TABLE "SavedPaymentMethod" (
    "id" TEXT NOT NULL,
    "type" "PaymentMethod" NOT NULL,
    "brand" TEXT,
    "last4" TEXT,
    "expiry" TEXT,
    "phone" TEXT,
    "accountNumber" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreConfig" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "isSocialLoginEnabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreConfig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavedPaymentMethod" ADD CONSTRAINT "SavedPaymentMethod_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
