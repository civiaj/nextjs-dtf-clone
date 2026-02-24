import { TPageResult } from '@/shared/types/common.types'
import {
    TReactionCommentSelect,
    TReactionConfig,
    TReactionMetrics,
    TReactionPostSelect,
    ReactionTarget,
    TReactionValueSelect
} from '@/shared/types/reaction.types'

export type TUpdateReactionPayload = { userId: number; targetId: number; reactionValueId: number }
export type TGetAllReactionPayload = { userId: number; cursor?: number }
export type TGetReactionMetricsPayload = { ids: number[]; userId?: number }

export interface IReactionRepository<Select, MetricsMap> {
    update(payload: TUpdateReactionPayload): Promise<Select | void>
    getAll(payload: TGetAllReactionPayload): Promise<TPageResult<Select>>
    getMetrics(payload: TGetReactionMetricsPayload): Promise<MetricsMap>
}

export interface IReactionValueRepository {
    getAll(): Promise<TReactionValueSelect[]>
    getDefaultValue(): Promise<TReactionValueSelect | null>
}

export interface IReactionService {
    update<T extends ReactionTarget = ReactionTarget>(
        payload: TUpdateReactionPayload & { target: T }
    ): Promise<TReactionMetrics>
    getAll<T extends ReactionTarget = ReactionTarget>(
        payload: TGetAllReactionPayload & { target: T }
    ): Promise<TPageResult<TReactionConfig[T]['select']>>
    getMetrics<T extends ReactionTarget = ReactionTarget>(
        payload: TGetReactionMetricsPayload & { target: T }
    ): Promise<TReactionConfig[T]['metrics']>
}

export interface IReactionRepositories {
    POST: IReactionRepository<TReactionPostSelect, TReactionConfig['POST']['metrics']>
    COMMENT: IReactionRepository<TReactionCommentSelect, TReactionConfig['COMMENT']['metrics']>
}
