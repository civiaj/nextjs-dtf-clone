import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from 'next/server'
import { AppMiddleware, MiddlewareResponse } from './types'

export const stackMiddlewares =
    (middlewares: AppMiddleware[]): NextMiddleware =>
    async (request: NextRequest, event: NextFetchEvent) => {
        const response = await middlewares.reduce(
            async (response: MiddlewareResponse, current) => {
                const middlewareResponse = await current(request, response, event)
                return middlewareResponse
            },
            new Promise<NextResponse<unknown> | undefined>((resolve) => {
                resolve(NextResponse.next())
            })
        )
        if (response === undefined) {
            return NextResponse.next()
        }
        return response
    }
