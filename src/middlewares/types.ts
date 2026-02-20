import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export type MiddlewareResponse = Promise<NextResponse<unknown> | undefined>
export type AppMiddleware = (
    request: NextRequest,
    response: MiddlewareResponse,
    event: NextFetchEvent
) => MiddlewareResponse
