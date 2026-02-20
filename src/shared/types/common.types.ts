export type UserAgent = {
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
export interface ApiErrorResponse {
    message: string
    errors: string[]
    status: number
}
export interface ResponseBase<T> {
    message: string
    result: T
}
export type InferObjectValueType<T> = T extends { [key: string]: infer U } ? U : never
export type TLocalId = string
export type TPageResult<T> = { items: T[]; cursor: number | null }
