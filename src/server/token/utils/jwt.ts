import jwt from 'jsonwebtoken'
import {
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN
} from '@/server/constants'
import { TokenPayload } from '../types'

const jwtSignAccess = (payload: TokenPayload, options: jwt.SignOptions = {}) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: ACCESS_TOKEN.options.maxAge,
        ...options
    })
}
const jwtSignRefresh = (payload: TokenPayload, options: jwt.SignOptions = {}) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: REFRESH_TOKEN.options.maxAge,
        ...options
    })
}
export const jwtVerifyAccess = (token: string) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload
    } catch {
        return null
    }
}
export const jwtVerifyRefresh = (token: string) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload
    } catch {
        return null
    }
}
export const jwtCreatePair = (payload: TokenPayload, options?: jwt.SignOptions) => {
    const accessToken = jwtSignAccess(payload, options)
    const refreshToken = jwtSignRefresh(payload, options)
    return { accessToken, refreshToken }
}

export const getRefreshTokenExpires = () => {
    return new Date(Date.now() + REFRESH_TOKEN.options.maxAge * 1000)
}
