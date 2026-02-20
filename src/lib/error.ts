import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { ApiErrorResponse } from '@/shared/types/common.types'

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public errors: string[] = []
    ) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static Unauthorized(message: string, errors?: string[]) {
        return new ApiError(message, 401, errors)
    }

    static BadRequest(message: string, errors?: string[]) {
        return new ApiError(message, 400, errors)
    }

    static NotAllowed(message: string, errors?: string[]) {
        return new ApiError(message, 403, errors)
    }
    static NotFound(message: string, errors?: []) {
        return new ApiError(message, 404, errors)
    }
}

export const apiErrorHandler = (error: unknown): NextResponse<ApiErrorResponse> => {
    if (error instanceof ZodError) {
        const errors = error.issues.map((err) => err.message)

        return NextResponse.json(
            { message: errors[0] ?? 'Ошибка валидации', errors, status: 400 },
            { status: 400 }
        )
    }

    if (error instanceof ApiError) {
        const { errors, message, status } = error
        const response = NextResponse.json({ message, errors, status }, { status })
        return response
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const { message } = error
        const response = NextResponse.json(
            { message: 'Ошибка в работе с базой данных', status: 404, errors: [message] },
            { status: 404 }
        )
        return response
    }

    const errors = [error instanceof Error ? error.message : JSON.stringify(error)]

    return NextResponse.json(
        { message: 'Неизвестная ошибка', errors, status: 500 },
        { status: 500 }
    )
}

export const formatErrorMessage = (error: unknown) => {
    if (typeof error === 'object' && error !== null) {
        if ('message' in error && typeof error.message === 'string') {
            return error.message
        }
        if (
            'data' in error &&
            typeof error.data === 'object' &&
            error.data !== null &&
            'message' in error.data &&
            typeof error.data.message === 'string'
        ) {
            return error.data.message
        }
    }

    return 'Произошла ошибка'
}
