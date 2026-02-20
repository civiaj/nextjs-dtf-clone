import { NextRequest } from 'next/server'

const restrictedForAuth: string[] = ['GET:/login', 'GET:/signup']

const privatePaths: string[] = ['GET:/settings']

const isPrivatePath = (req: NextRequest) => {
    return privatePaths.includes(`${req.method}:${req.nextUrl.pathname}`)
}

const _isOnlyPublicPath = (req: NextRequest) => {
    return restrictedForAuth.includes(`${req.method}:${req.nextUrl.pathname}`)
}

export const redirectMiddleware = (req: NextRequest, accessToken?: string) => {
    if (!accessToken && isPrivatePath(req)) {
        // return NextResponse.redirect(new URL(PATH.LOGIN, req.url))
    }

    // Если токен есть, но он неверный, то не дает зайти на страницу restrictedForAuth
    // if (accessToken && isOnlyPublicPath(req)) {
    //     return NextResponse.redirect(new URL(PATH.MAIN, req.url))
    // }
}
