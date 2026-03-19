-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('PUBLISHED', 'DRAFT', 'DELETED');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('image', 'video');

-- CreateEnum
CREATE TYPE "FileFormat" AS ENUM ('mp4', 'webp', 'gif', 'jpeg');

-- CreateEnum
CREATE TYPE "MediaContext" AS ENUM ('DEFAULT', 'AVATAR', 'COVER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "avatarId" INTEGER,
    "avatarColorId" INTEGER NOT NULL,
    "coverId" INTEGER,
    "coverY" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "userId" INTEGER NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "hotScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hotnessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blocks" (
    "id" SERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "deviceInfo" JSONB NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "original_hash" TEXT NOT NULL,
    "processed_hash" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "src" TEXT NOT NULL,
    "blurDataURL" TEXT NOT NULL,
    "format" "FileFormat" NOT NULL,
    "duration" INTEGER,
    "thumbnail" TEXT,
    "context" "MediaContext" NOT NULL DEFAULT 'DEFAULT',

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMediaUpload" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMediaUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "json" JSONB,
    "mediaId" INTEGER,
    "path" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "hotScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hotnessScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvatarColor" (
    "id" SERIAL NOT NULL,
    "value" VARCHAR(7) NOT NULL,

    CONSTRAINT "AvatarColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuteUser" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "targetUserId" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MuteUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MutePost" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "targetPostId" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MutePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUser" (
    "id" SERIAL NOT NULL,
    "subscriberId" INTEGER NOT NULL,
    "targetUserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReactionValue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,

    CONSTRAINT "ReactionValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReactionPost" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "targetPostId" INTEGER NOT NULL,
    "reactionValueId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReactionPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReactionComment" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "targetCommentId" INTEGER NOT NULL,
    "reactionValueId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReactionComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookmarkPost" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "targetPostId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookmarkPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookmarkComment" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "targetCommentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookmarkComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE INDEX "Post_slug_idx" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "Post"("userId");

-- CreateIndex
CREATE INDEX "Post_status_publishedAt_id_idx" ON "Post"("status", "publishedAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Post_status_hotnessScore_publishedAt_id_idx" ON "Post"("status", "hotnessScore" DESC, "publishedAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Post_status_hotScore_publishedAt_id_idx" ON "Post"("status", "hotScore" DESC, "publishedAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Post_userId_status_createdAt_id_idx" ON "Post"("userId", "status", "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Post_userId_status_hotnessScore_createdAt_id_idx" ON "Post"("userId", "status", "hotnessScore" DESC, "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Post_userId_status_hotScore_createdAt_id_idx" ON "Post"("userId", "status", "hotScore" DESC, "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Blocks_postId_idx" ON "Blocks"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "Blocks_userId_postId_key" ON "Blocks"("userId", "postId");

-- CreateIndex
CREATE INDEX "Token_id_idx" ON "Token"("id");

-- CreateIndex
CREATE INDEX "Token_userId_idx" ON "Token"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_id_key" ON "Token"("id");

-- CreateIndex
CREATE INDEX "Media_original_hash_idx" ON "Media"("original_hash");

-- CreateIndex
CREATE INDEX "Media_processed_hash_idx" ON "Media"("processed_hash");

-- CreateIndex
CREATE INDEX "UserMediaUpload_mediaId_idx" ON "UserMediaUpload"("mediaId");

-- CreateIndex
CREATE INDEX "UserMediaUpload_userId_idx" ON "UserMediaUpload"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMediaUpload_userId_mediaId_key" ON "UserMediaUpload"("userId", "mediaId");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- CreateIndex
CREATE INDEX "Comment_postId_parentId_createdAt_id_idx" ON "Comment"("postId", "parentId", "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Comment_postId_parentId_hotnessScore_createdAt_id_idx" ON "Comment"("postId", "parentId", "hotnessScore" DESC, "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Comment_userId_createdAt_id_idx" ON "Comment"("userId", "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Comment_userId_hotnessScore_createdAt_id_idx" ON "Comment"("userId", "hotnessScore" DESC, "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Comment_userId_hotScore_createdAt_id_idx" ON "Comment"("userId", "hotScore" DESC, "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "AvatarColor_value_key" ON "AvatarColor"("value");

-- CreateIndex
CREATE INDEX "MuteUser_ownerId_idx" ON "MuteUser"("ownerId");

-- CreateIndex
CREATE INDEX "MuteUser_targetUserId_idx" ON "MuteUser"("targetUserId");

-- CreateIndex
CREATE UNIQUE INDEX "MuteUser_ownerId_targetUserId_key" ON "MuteUser"("ownerId", "targetUserId");

-- CreateIndex
CREATE INDEX "MutePost_ownerId_idx" ON "MutePost"("ownerId");

-- CreateIndex
CREATE INDEX "MutePost_targetPostId_idx" ON "MutePost"("targetPostId");

-- CreateIndex
CREATE UNIQUE INDEX "MutePost_ownerId_targetPostId_key" ON "MutePost"("ownerId", "targetPostId");

-- CreateIndex
CREATE INDEX "FollowUser_subscriberId_idx" ON "FollowUser"("subscriberId");

-- CreateIndex
CREATE INDEX "FollowUser_targetUserId_idx" ON "FollowUser"("targetUserId");

-- CreateIndex
CREATE UNIQUE INDEX "FollowUser_subscriberId_targetUserId_key" ON "FollowUser"("subscriberId", "targetUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ReactionValue_name_key" ON "ReactionValue"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ReactionValue_emoji_key" ON "ReactionValue"("emoji");

-- CreateIndex
CREATE INDEX "ReactionPost_ownerId_idx" ON "ReactionPost"("ownerId");

-- CreateIndex
CREATE INDEX "ReactionPost_targetPostId_idx" ON "ReactionPost"("targetPostId");

-- CreateIndex
CREATE UNIQUE INDEX "ReactionPost_ownerId_targetPostId_key" ON "ReactionPost"("ownerId", "targetPostId");

-- CreateIndex
CREATE INDEX "ReactionComment_ownerId_idx" ON "ReactionComment"("ownerId");

-- CreateIndex
CREATE INDEX "ReactionComment_targetCommentId_idx" ON "ReactionComment"("targetCommentId");

-- CreateIndex
CREATE UNIQUE INDEX "ReactionComment_ownerId_targetCommentId_key" ON "ReactionComment"("ownerId", "targetCommentId");

-- CreateIndex
CREATE INDEX "BookmarkPost_ownerId_idx" ON "BookmarkPost"("ownerId");

-- CreateIndex
CREATE INDEX "BookmarkPost_targetPostId_idx" ON "BookmarkPost"("targetPostId");

-- CreateIndex
CREATE UNIQUE INDEX "BookmarkPost_ownerId_targetPostId_key" ON "BookmarkPost"("ownerId", "targetPostId");

-- CreateIndex
CREATE INDEX "BookmarkComment_ownerId_idx" ON "BookmarkComment"("ownerId");

-- CreateIndex
CREATE INDEX "BookmarkComment_targetCommentId_idx" ON "BookmarkComment"("targetCommentId");

-- CreateIndex
CREATE UNIQUE INDEX "BookmarkComment_ownerId_targetCommentId_key" ON "BookmarkComment"("ownerId", "targetCommentId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarColorId_fkey" FOREIGN KEY ("avatarColorId") REFERENCES "AvatarColor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocks" ADD CONSTRAINT "Blocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocks" ADD CONSTRAINT "Blocks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMediaUpload" ADD CONSTRAINT "UserMediaUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMediaUpload" ADD CONSTRAINT "UserMediaUpload_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuteUser" ADD CONSTRAINT "MuteUser_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MuteUser" ADD CONSTRAINT "MuteUser_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutePost" ADD CONSTRAINT "MutePost_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutePost" ADD CONSTRAINT "MutePost_targetPostId_fkey" FOREIGN KEY ("targetPostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUser" ADD CONSTRAINT "FollowUser_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUser" ADD CONSTRAINT "FollowUser_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionPost" ADD CONSTRAINT "ReactionPost_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionPost" ADD CONSTRAINT "ReactionPost_targetPostId_fkey" FOREIGN KEY ("targetPostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionPost" ADD CONSTRAINT "ReactionPost_reactionValueId_fkey" FOREIGN KEY ("reactionValueId") REFERENCES "ReactionValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionComment" ADD CONSTRAINT "ReactionComment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionComment" ADD CONSTRAINT "ReactionComment_targetCommentId_fkey" FOREIGN KEY ("targetCommentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionComment" ADD CONSTRAINT "ReactionComment_reactionValueId_fkey" FOREIGN KEY ("reactionValueId") REFERENCES "ReactionValue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkPost" ADD CONSTRAINT "BookmarkPost_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkPost" ADD CONSTRAINT "BookmarkPost_targetPostId_fkey" FOREIGN KEY ("targetPostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkComment" ADD CONSTRAINT "BookmarkComment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookmarkComment" ADD CONSTRAINT "BookmarkComment_targetCommentId_fkey" FOREIGN KEY ("targetCommentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;


