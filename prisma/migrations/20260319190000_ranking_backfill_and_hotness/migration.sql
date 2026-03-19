-- Ensure ranking columns exist for databases created before ranking rollout.
ALTER TABLE "Post"
ADD COLUMN IF NOT EXISTS "hotScore" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "hotnessScore" DOUBLE PRECISION;

ALTER TABLE "Comment"
ADD COLUMN IF NOT EXISTS "hotScore" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "hotnessScore" DOUBLE PRECISION;

-- Normalize nulls and enforce consistent defaults/constraints.
UPDATE "Post"
SET
    "hotScore" = COALESCE("hotScore", 0),
    "hotnessScore" = COALESCE("hotnessScore", 0);

ALTER TABLE "Post"
ALTER COLUMN "hotScore" SET DEFAULT 0,
ALTER COLUMN "hotnessScore" SET DEFAULT 0,
ALTER COLUMN "hotScore" SET NOT NULL,
ALTER COLUMN "hotnessScore" SET NOT NULL;

UPDATE "Comment"
SET
    "hotScore" = COALESCE("hotScore", 0),
    "hotnessScore" = COALESCE("hotnessScore", 0);

ALTER TABLE "Comment"
ALTER COLUMN "hotScore" SET DEFAULT 0,
ALTER COLUMN "hotnessScore" SET DEFAULT 0,
ALTER COLUMN "hotScore" SET NOT NULL,
ALTER COLUMN "hotnessScore" SET NOT NULL;

-- Ensure indexes required by ranking sorts exist.
CREATE INDEX IF NOT EXISTS "Post_status_publishedAt_id_idx"
ON "Post"("status", "publishedAt" DESC, "id" DESC);

CREATE INDEX IF NOT EXISTS "Post_status_hotnessScore_publishedAt_id_idx"
ON "Post"("status", "hotnessScore" DESC, "publishedAt" DESC, "id" DESC);

CREATE INDEX IF NOT EXISTS "Post_status_hotScore_publishedAt_id_idx"
ON "Post"("status", "hotScore" DESC, "publishedAt" DESC, "id" DESC);

CREATE INDEX IF NOT EXISTS "Post_userId_status_createdAt_id_idx"
ON "Post"("userId", "status", "createdAt" DESC, "id" DESC);

CREATE INDEX IF NOT EXISTS "Post_userId_status_hotnessScore_createdAt_id_idx"
ON "Post"("userId", "status", "hotnessScore" DESC, "createdAt" DESC, "id" DESC);

CREATE INDEX IF NOT EXISTS "Post_userId_status_hotScore_createdAt_id_idx"
ON "Post"("userId", "status", "hotScore" DESC, "createdAt" DESC, "id" DESC);

CREATE INDEX IF NOT EXISTS "Comment_postId_parentId_createdAt_id_idx"
ON "Comment"("postId", "parentId", "createdAt" DESC, "id" DESC);

CREATE INDEX IF NOT EXISTS "Comment_postId_parentId_hotnessScore_createdAt_id_idx"
ON "Comment"("postId", "parentId", "hotnessScore" DESC, "createdAt" DESC, "id" DESC);

CREATE INDEX IF NOT EXISTS "Comment_userId_createdAt_id_idx"
ON "Comment"("userId", "createdAt" DESC, "id" DESC);

CREATE INDEX IF NOT EXISTS "Comment_userId_hotnessScore_createdAt_id_idx"
ON "Comment"("userId", "hotnessScore" DESC, "createdAt" DESC, "id" DESC);

CREATE INDEX IF NOT EXISTS "Comment_userId_hotScore_createdAt_id_idx"
ON "Comment"("userId", "hotScore" DESC, "createdAt" DESC, "id" DESC);

-- One-time backfill for posts.
WITH post_aggregates AS (
    SELECT
        p."id",
        COALESCE(r."reactionCount", 0) AS "reactionCount",
        COALESCE(b."bookmarkCount", 0) AS "bookmarkCount",
        COALESCE(c."commentCount", 0) AS "commentCount",
        COALESCE(p."publishedAt", p."createdAt") AS "rankedAt"
    FROM "Post" p
    LEFT JOIN (
        SELECT "targetPostId", COUNT(*)::DOUBLE PRECISION AS "reactionCount"
        FROM "ReactionPost"
        GROUP BY "targetPostId"
    ) r ON r."targetPostId" = p."id"
    LEFT JOIN (
        SELECT "targetPostId", COUNT(*)::DOUBLE PRECISION AS "bookmarkCount"
        FROM "BookmarkPost"
        GROUP BY "targetPostId"
    ) b ON b."targetPostId" = p."id"
    LEFT JOIN (
        SELECT "postId", COUNT(*)::DOUBLE PRECISION AS "commentCount"
        FROM "Comment"
        WHERE "isDeleted" = false
        GROUP BY "postId"
    ) c ON c."postId" = p."id"
),
post_scores AS (
    SELECT
        "id",
        ("reactionCount" * 1.0 + "bookmarkCount" * 2.0 + "commentCount" * 1.0) AS "hotScore",
        "rankedAt"
    FROM post_aggregates
)
UPDATE "Post" p
SET
    "hotScore" = s."hotScore",
    "hotnessScore" = CASE
        WHEN s."hotScore" <= 0 THEN 0
        ELSE s."hotScore" / POWER(
            GREATEST(EXTRACT(EPOCH FROM (NOW() - s."rankedAt")) / 3600.0, 0) + 2.0,
            1.35
        )
    END
FROM post_scores s
WHERE p."id" = s."id";

-- One-time backfill for comments.
WITH comment_aggregates AS (
    SELECT
        c."id",
        COALESCE(r."reactionCount", 0) AS "reactionCount",
        COALESCE(b."bookmarkCount", 0) AS "bookmarkCount",
        COALESCE(dr."replyCount", 0) AS "replyCount",
        c."createdAt" AS "rankedAt"
    FROM "Comment" c
    LEFT JOIN (
        SELECT "targetCommentId", COUNT(*)::DOUBLE PRECISION AS "reactionCount"
        FROM "ReactionComment"
        GROUP BY "targetCommentId"
    ) r ON r."targetCommentId" = c."id"
    LEFT JOIN (
        SELECT "targetCommentId", COUNT(*)::DOUBLE PRECISION AS "bookmarkCount"
        FROM "BookmarkComment"
        GROUP BY "targetCommentId"
    ) b ON b."targetCommentId" = c."id"
    LEFT JOIN (
        SELECT "parentId", COUNT(*)::DOUBLE PRECISION AS "replyCount"
        FROM "Comment"
        WHERE "parentId" IS NOT NULL
          AND "isDeleted" = false
        GROUP BY "parentId"
    ) dr ON dr."parentId" = c."id"
),
comment_scores AS (
    SELECT
        "id",
        ("reactionCount" * 1.0 + "bookmarkCount" * 2.0 + "replyCount" * 1.5) AS "hotScore",
        "rankedAt"
    FROM comment_aggregates
)
UPDATE "Comment" c
SET
    "hotScore" = s."hotScore",
    "hotnessScore" = CASE
        WHEN s."hotScore" <= 0 THEN 0
        ELSE s."hotScore" / POWER(
            GREATEST(EXTRACT(EPOCH FROM (NOW() - s."rankedAt")) / 3600.0, 0) + 2.0,
            1.35
        )
    END
FROM comment_scores s
WHERE c."id" = s."id";
