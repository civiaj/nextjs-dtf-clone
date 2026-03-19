import { IRankingService } from '@/server/ranking'
import { TPageResult } from '@/shared/types/common.types'
import { TReactionConfig, TReactionMetrics, ReactionTarget } from '@/shared/types/reaction.types'
import {
    IReactionRepositories,
    IReactionService,
    IReactionValueRepository,
    TGetAllReactionPayload,
    TGetReactionMetricsPayload,
    TUpdateReactionPayload
} from './types'

export class ReactionService implements IReactionService {
    constructor(
        private repositories: IReactionRepositories,
        private valueRepository: IReactionValueRepository,
        private rankingService: IRankingService
    ) {}
    async update<T extends ReactionTarget>({
        target,
        ...payload
    }: TUpdateReactionPayload & { target: T }): Promise<TReactionMetrics> {
        await this.repositories[target].update(payload)

        const [metrics, _] = await Promise.all([
            this.repositories[target].getMetrics({
                ids: [payload.targetId],
                userId: payload.userId
            }),
            this.rankingService.recalculateByTarget(target, payload.targetId)
        ])

        return metrics.get(payload.targetId)!
    }

    async getAll<T extends ReactionTarget>({
        target,
        ...payload
    }: TGetAllReactionPayload & { target: T }): Promise<TPageResult<TReactionConfig[T]['select']>> {
        return await this.repositories[target].getAll(payload)
    }

    async getMetrics<T extends ReactionTarget>({
        target,
        ...payload
    }: TGetReactionMetricsPayload & { target: T }): Promise<TReactionConfig[T]['metrics']> {
        return await this.repositories[target].getMetrics(payload)
    }

    async getAssets() {
        return await this.valueRepository.getAll()
    }

    async getDefaultReaction() {
        return await this.valueRepository.getDefaultValue()
    }
}
