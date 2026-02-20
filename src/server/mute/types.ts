import { TPageResult } from '@/shared/types/common.types'
import {
    TMutePostMetrics,
    TMutePostSelect,
    TMuteTarget,
    TMuteUserMetrics,
    TMuteUserSelect
} from '@/shared/types/mute.types'
import { TPost } from '@/shared/types/post.types'
import { TUser } from '@/shared/types/user.types'

export interface IMuteValidator {
    validate(userId: number, targetId: number): Promise<void>
}

type TMuteConfig = {
    USER: {
        select: TMuteUserSelect
        metrics: TMuteUserMetrics
        id: TUser['id']
    }
    POST: {
        select: TMutePostSelect
        metrics: TMutePostMetrics
        id: TPost['id']
    }
}

export type TMuteMetrics<T extends TMuteTarget> = Map<
    TMuteConfig[T]['id'],
    TMuteConfig[T]['metrics']
>
export type TMuteSelect<T extends TMuteTarget> = TMuteConfig[T]['select']
export type TMuteTargetId<T extends TMuteTarget> = TMuteConfig[T]['id']

export interface IMuteMetricsStrategy<T extends TMuteTarget = TMuteTarget> {
    get(data: { userId?: TUser['id']; ids: TMuteTargetId<T>[] }): Promise<TMuteMetrics<T>>
}

export type TCreateMutePayload = { userId: number; targetId: number }
export type TRemoveMutePayload = { userId: number; targetId: number }
export type TGetAllMutesPayload = { userId: number; cursor?: number }
export type TGetMuteMetricsPayload = { ids: number[]; userId?: number }

export interface IMuteRepository<Select, Metrics> {
    create(payload: TCreateMutePayload): Promise<Select | void>
    remove(payload: TRemoveMutePayload): Promise<Select | void>
    getAll(payload: TGetAllMutesPayload): Promise<TPageResult<Select>>
    getMetrics(payload: TGetMuteMetricsPayload): Promise<Metrics>
}

export interface IMuteService {
    create<T extends TMuteTarget = TMuteTarget>(
        payload: TCreateMutePayload & { target: T }
    ): Promise<TMuteSelect<T> | void>
    remove<T extends TMuteTarget = TMuteTarget>(
        payload: TRemoveMutePayload & { target: T }
    ): Promise<TMuteSelect<T> | void>
    getAll<T extends TMuteTarget = TMuteTarget>(
        payload: TGetAllMutesPayload & { target: T }
    ): Promise<TPageResult<TMuteSelect<T>>>
    getMetrics<T extends TMuteTarget = TMuteTarget>(
        payload: TGetMuteMetricsPayload & { target: T }
    ): Promise<TMuteMetrics<T>>
}

export interface IMuteRepositories {
    USER: IMuteRepository<TMuteUserSelect, TMuteMetrics<'USER'>>
    POST: IMuteRepository<TMutePostSelect, TMuteMetrics<'POST'>>
}
