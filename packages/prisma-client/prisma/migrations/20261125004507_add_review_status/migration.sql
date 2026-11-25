-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'HIDDEN');

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'APPROVED';
