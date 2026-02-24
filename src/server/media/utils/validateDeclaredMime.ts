import { ApiError } from '@/lib/error'
import { ERROR_MESSAGES } from '@/shared/constants'

export const validateDeclaredMime = (declaredMime: string, detectedMime: string): void => {
    if (!declaredMime || declaredMime === 'application/octet-stream') return

    const declaredCategory = declaredMime.split('/')[0]
    const detectedCategory = detectedMime.split('/')[0]

    if (declaredCategory !== detectedCategory) {
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.WRONG_FORMAT(declaredMime))
    }
}
