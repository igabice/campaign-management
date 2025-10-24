-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "approver_id" TEXT,
ADD COLUMN     "approval_status" TEXT DEFAULT 'none',
ADD COLUMN     "approval_notes" TEXT,
ADD COLUMN     "approved_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "approver_id" TEXT,
ADD COLUMN     "approval_status" TEXT DEFAULT 'none',
ADD COLUMN     "approval_notes" TEXT,
ADD COLUMN     "approved_at" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;