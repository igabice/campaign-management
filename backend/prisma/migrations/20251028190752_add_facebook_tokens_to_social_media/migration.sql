-- AlterTable
ALTER TABLE "social_media" ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "page_id" TEXT,
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "token_expiry" TIMESTAMP(3);
