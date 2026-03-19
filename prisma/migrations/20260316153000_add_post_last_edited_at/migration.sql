-- AlterTable
ALTER TABLE "Post"
ADD COLUMN "lastEditedAt" TIMESTAMP(3);

-- Backfill
-- For already published posts, initialize lastEditedAt to publish time
-- so they are not marked as edited by default.
UPDATE "Post"
SET "lastEditedAt" = COALESCE("publishedAt", "createdAt")
WHERE "status" = 'PUBLISHED'
  AND "lastEditedAt" IS NULL;
