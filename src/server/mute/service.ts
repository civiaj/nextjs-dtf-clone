import { TPageResult } from '@/shared/types/common.types'
import { TMuteTarget } from '@/shared/types/mute.types'
import { CreateMuteInput } from '@/shared/validation/mute.schema'
import {
    IMuteRepositories,
    IMuteService,
    TCreateMutePayload,
    TGetAllMutesPayload,
    TGetMuteMetricsPayload,
    TMuteMetrics,
    TMuteSelect,
    TRemoveMutePayload
} from './types'

export class MuteService implements IMuteService {
    constructor(private readonly repositories: IMuteRepositories) {}
    async create<T extends TMuteTarget>({
        target,
        ...payload
    }: TCreateMutePayload & { target: T }): Promise<TMuteSelect<T> | void> {
        return await this.repositories[target].create(payload)
    }

    async remove<T extends TMuteTarget>({
        target,
        ...payload
    }: TRemoveMutePayload & { target: T }): Promise<TMuteSelect<T> | void> {
        return await this.repositories[target].remove(payload)
    }

    async getAll<T extends TMuteTarget>({
        target,
        ...payload
    }: TGetAllMutesPayload & { target: T }): Promise<TPageResult<TMuteSelect<T>>> {
        return await this.repositories[target].getAll(payload)
    }

    async getMetrics<T extends TMuteTarget>({
        target,
        ...payload
    }: TGetMuteMetricsPayload & { target: T }): Promise<TMuteMetrics<T>> {
        return await this.repositories[target].getMetrics(payload)
    }

    async update<T extends TMuteTarget>({
        target,
        action,
        ...payload
    }: TCreateMutePayload & {
        target: T
        action: CreateMuteInput['action']
    }): Promise<TMuteSelect<T> | void> {
        if (action === 'mute') {
            return await this.create({ target, ...payload })
        } else if (action === 'unmute') {
            return await this.remove({ target, ...payload })
        }
    }
}
