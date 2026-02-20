import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

// common
export type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
export type RouteParamsId = { params: Promise<{ id: string }> }
export type Cookie = {
    key: string
    options: Partial<ResponseCookie>
} & { options: { maxAge: number } }

export type ResponseError = { message: string; errors: string[] }
export type ResponseErrorHook = { data: ResponseError; status: number }
export type ProcessedErrorType = 'server' | 'form'
export type ProcessedError = { type: ProcessedErrorType; error: string } | null
export type TimeStamp = {
    createdAt: string
    updatedAt: string
}

// hz
export type TGroup = { id: string; name: string; uri: string }
export type TReactions = 'flame' | 'love'
export type TReactionsData = { type: TReactions; count: number }
export type TPostPreviewStats = {
    comments: number
    views: number
    opens: number
}

// Responses
export interface TResponseBase<T> {
    message: string
    result: T
}

// page/user
export type TUserAvatarEditOption = 'preview' | 'edit' | 'delete' | 'confirm-delete'
export type TDeviceInfo = {
    os: {
        name?: string
        version?: string
    }
    ua: string
    browser: {
        name?: string
        version?: string
    }
}

export type TPageWithFilter = { params: Promise<{ filter: string[] }> }
export type TParamsSlug = { params: Promise<{ slug: string }> }
