import { Prisma } from '@prisma/client'

export const mediaSelect = Prisma.validator<Prisma.MediaSelect>()({
    blurDataURL: true,
    duration: true,
    format: true,
    height: true,
    id: true,
    size: true,
    src: true,
    thumbnail: true,
    type: true,
    width: true,
    original_hash: true,
    processed_hash: true
})

export const userSelect = Prisma.validator<Prisma.UserSelect>()({
    avatar: { select: mediaSelect },
    cover: { select: mediaSelect },
    avatarColor: { select: { value: true } },
    coverY: true,
    createdAt: true,
    name: true,
    role: true,
    id: true,
    description: true
})

export const authSelect = Prisma.validator<Prisma.TokenSelect>()({
    user: { select: userSelect },
    expires: true,
    deviceInfo: true,
    id: true
})

export const postSelect = Prisma.validator<Prisma.PostSelect>()({
    user: { select: userSelect },
    blocks: { select: { data: true } },
    id: true,
    slug: true,
    status: true,
    title: true,
    updatedAt: true,
    createdAt: true,
    publishedAt: true
})

export const muteUserSelect = Prisma.validator<Prisma.MuteUserSelect>()({
    id: true,
    ownerId: true,
    targetUserId: true,
    reason: true,
    createdAt: true
})

export const mutePostSelect = Prisma.validator<Prisma.MutePostSelect>()({
    id: true,
    ownerId: true,
    targetPostId: true,
    reason: true,
    createdAt: true
})

export const commentSelect = Prisma.validator<Prisma.CommentSelect>()({
    id: true,
    user: { select: userSelect },
    json: true,
    media: true,
    createdAt: true,
    parentId: true,
    isDeleted: true,
    postId: true,
    post: { select: { slug: true, title: true } },
    replyCount: true
})

export const followUserSelect = Prisma.validator<Prisma.FollowUserSelect>()({
    id: true,
    createdAt: true,
    subscriberId: true,
    targetUserId: true
})

export const reactionPostSelect = Prisma.validator<Prisma.ReactionPostSelect>()({
    id: true,
    ownerId: true,
    targetPostId: true,
    reactionValue: { select: { emoji: true, id: true, name: true } }
})

export const reactionCommentSelect = Prisma.validator<Prisma.ReactionCommentSelect>()({
    id: true,
    ownerId: true,
    targetCommentId: true,
    reactionValue: { select: { emoji: true, id: true, name: true } }
})

export const reactionValueSelect = Prisma.validator<Prisma.ReactionValueSelect>()({
    emoji: true,
    id: true,
    name: true
})

export const bookmarkPostSelect = Prisma.validator<Prisma.BookmarkPostSelect>()({
    id: true,
    createdAt: true,
    ownerId: true,
    targetPostId: true
})

export const bookmarkCommentSelect = Prisma.validator<Prisma.BookmarkCommentSelect>()({
    id: true,
    createdAt: true,
    ownerId: true,
    targetCommentId: true
})
