import { Cookie } from '@/shared/types'

export const ACCESS_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET as string
export const REFRESH_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET as string

let secure = true
const isDevelopment = process.env.NODE_ENV === 'development'

if (isDevelopment) {
    secure = false
}

export const ACCESS_TOKEN: Cookie = {
    key: 'access_token',
    options: { maxAge: 900, httpOnly: true, sameSite: 'strict', secure }
}
export const REFRESH_TOKEN: Cookie = {
    key: 'refresh_token',
    options: { maxAge: 2592000, httpOnly: true, sameSite: 'strict', secure }
}
