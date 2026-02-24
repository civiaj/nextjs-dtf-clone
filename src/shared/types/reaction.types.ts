import {
    Prisma,
    reactionCommentSelect,
    reactionPostSelect,
    ReactionValue,
    reactionValueSelect
} from '@/shared/services/prisma'
import { TComment } from '@/shared/types/comment.types'
import { TPost } from '@/shared/types/post.types'

export const reactionTarget = ['POST', 'COMMENT'] as const
export type ReactionTarget = (typeof reactionTarget)[number]

export type TReactionPostSelect = Prisma.ReactionPostGetPayload<{
    select: typeof reactionPostSelect
}>
export type TReactionCommentSelect = Prisma.ReactionCommentGetPayload<{
    select: typeof reactionCommentSelect
}>
export type TReactionValueSelect = Prisma.ReactionValueGetPayload<{
    select: typeof reactionValueSelect
}>
export type TReaction = TReactionValueSelect
export type TReactionEntityData = TReactionValueSelect & { count: number }
export type TReactionMetrics = {
    reactions: {
        items: TReactionEntityData[]
        activeReactionId: null | ReactionValue['id']
    }
}
export type TReactionConfig = {
    POST: {
        select: TReactionPostSelect
        metrics: Map<TPost['id'], TReactionMetrics>
        id: TPost['id']
    }
    COMMENT: {
        select: TReactionCommentSelect
        metrics: Map<TComment['id'], TReactionMetrics>
        id: TComment['id']
    }
}
export type TReactionAssets = {
    items: TReaction[]
    defaultValue: TReaction | null
}
