ALTER TABLE "Post"
ADD COLUMN IF NOT EXISTS "nextHotnessRefreshAt" TIMESTAMP(3);

ALTER TABLE "Comment"
ADD COLUMN IF NOT EXISTS "nextHotnessRefreshAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Post_status_nextHotnessRefreshAt_id_idx"
ON "Post"("status", "nextHotnessRefreshAt", "id");

CREATE INDEX IF NOT EXISTS "Comment_isDeleted_nextHotnessRefreshAt_id_idx"
ON "Comment"("isDeleted", "nextHotnessRefreshAt", "id");

-- Seed refresh queue for active recent ranked rows.
UPDATE "Post"
SET "nextHotnessRefreshAt" = NOW()
WHERE "status" = 'PUBLISHED'
  AND COALESCE("publishedAt", "createdAt") >= NOW() - INTERVAL '30 days'
  AND "hotScore" > 0;

UPDATE "Comment"
SET "nextHotnessRefreshAt" = NOW()
WHERE "isDeleted" = false
  AND "createdAt" >= NOW() - INTERVAL '30 days'
  AND "hotScore" > 0;
