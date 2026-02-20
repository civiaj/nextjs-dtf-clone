import {
    TBookmarkCommentSelect,
    TBookmarkConfig,
    TBookmarkPostSelect
} from '@/shared/types/bookmark.types'
import { TPageResult } from '@/shared/types/common.types'
import { BookmarkTarget } from '@/shared/validation/bookmark.schema'

export type TUpdateBookmarkPayload = {
    userId: number
    targetId: number
}

export type TGetAllBookmarkPayload = {
    userId: number
    cursor?: number
}

export type TGetBookmarkMetricsPayload = {
    ids: number[]
    userId?: number
}

export interface IBookmarkRepository<Select, MetricsMap> {
    update(payload: TUpdateBookmarkPayload): Promise<Select | void>
    getAll(payload: TGetAllBookmarkPayload): Promise<TPageResult<Select>>
    getMetrics(payload: TGetBookmarkMetricsPayload): Promise<MetricsMap>
}

export interface IBookmarkService {
    update<T extends BookmarkTarget = BookmarkTarget>(
        payload: TUpdateBookmarkPayload & { target: T }
    ): Promise<TBookmarkConfig[T]['select'] | void>
    getAll<T extends BookmarkTarget = BookmarkTarget>(
        payload: TGetAllBookmarkPayload & { target: T }
    ): Promise<TPageResult<TBookmarkConfig[T]['select']>>
    getMetrics<T extends BookmarkTarget = BookmarkTarget>(
        payload: TGetBookmarkMetricsPayload & { target: T }
    ): Promise<TBookmarkConfig[T]['metrics']>
}

export interface IBookmarkRepositories {
    POST: IBookmarkRepository<TBookmarkPostSelect, TBookmarkConfig['POST']['metrics']>
    COMMENT: IBookmarkRepository<TBookmarkCommentSelect, TBookmarkConfig['COMMENT']['metrics']>
}
