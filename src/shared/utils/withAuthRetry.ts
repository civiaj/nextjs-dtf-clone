import { isHttpError } from '@/shared/utils/isHttpError'

export const withAuthRetry = async <T>(request: () => Promise<T>): Promise<T> => {
    try {
        return await request()
    } catch (error: unknown) {
        if (isHttpError(error) && error.status === 401) {
            try {
                const response = await fetch('/api/refresh', {
                    method: 'POST',
                    credentials: 'include'
                })
                if (!response.ok) {
                    const data = await response.json()
                    throw data
                }
                return await request()
            } catch {
                throw new Error('Unauthorized')
            }
        }
        throw error
    }
}
