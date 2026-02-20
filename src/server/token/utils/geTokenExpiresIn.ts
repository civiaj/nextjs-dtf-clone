import { REFRESH_TOKEN } from '@/server/constants'

export const getTokenExpiresIn = () => {
    return new Date(Date.now() + REFRESH_TOKEN.options.maxAge * 1000)
}
