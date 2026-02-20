import { NextResponse } from 'next/server'
import { AppMiddleware } from '@/middlewares/types'

export const withLog: AppMiddleware = async (request, response, _event) => {
    let res = await response
    if (!res) res = NextResponse.next()
    return res
}
