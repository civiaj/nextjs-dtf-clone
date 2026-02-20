import { TBookmarkConfig } from '@/shared/types/bookmark.types'
import { TPageResult } from '@/shared/types/common.types'
import { BookmarkTarget } from '@/shared/validation/bookmark.schema'
import {
    IBookmarkRepositories,
    IBookmarkService,
    TGetAllBookmarkPayload,
    TGetBookmarkMetricsPayload,
    TUpdateBookmarkPayload
} from './types'

export class BookmarkService implements IBookmarkService {
    constructor(private readonly repositories: IBookmarkRepositories) {}

    async update<T extends BookmarkTarget>({
        target,
        ...payload
    }: TUpdateBookmarkPayload & { target: T }): Promise<TBookmarkConfig[T]['select'] | void> {
        return await this.repositories[target].update(payload)
    }

    async getAll<T extends BookmarkTarget>({
        target,
        ...payload
    }: TGetAllBookmarkPayload & { target: T }): Promise<TPageResult<TBookmarkConfig[T]['select']>> {
        return await this.repositories[target].getAll(payload)
    }

    async getMetrics<T extends BookmarkTarget>({
        target,
        ...payload
    }: TGetBookmarkMetricsPayload & { target: T }): Promise<TBookmarkConfig[T]['metrics']> {
        return await this.repositories[target].getMetrics(payload)
    }
}
