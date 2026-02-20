import { EditorBlocks } from '@/entities/editor'
import { postSelect, Prisma } from '@/shared/services/prisma'
import { TBookmarkMetrics } from '@/shared/types/bookmark.types'
import { TMutePostMetrics } from '@/shared/types/mute.types'
import { TReactionMetrics } from '@/shared/types/reaction.types'
import { TUser } from '@/shared/types/user.types'

// POST
export type TPostSelect = Prisma.PostGetPayload<{ select: typeof postSelect }>
export type TPostData = Omit<TPostSelect, 'blocks'> & { blocks: EditorBlocks }
export type TPostCommentMetrics = { commentCount: number }
export type TPostMetrics = TMutePostMetrics &
    TPostCommentMetrics &
    TBookmarkMetrics &
    TReactionMetrics
export type TPost = Omit<TPostData, 'user'> & { user: TUser } & TPostMetrics
