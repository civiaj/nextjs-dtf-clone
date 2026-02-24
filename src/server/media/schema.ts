import { ApiError } from '@/lib/error'
import { ERROR_MESSAGES } from '@/shared/constants'
import {
    UploadMediaDTO,
    uploadMediaOptionsSchema,
    uploadMediaSchema
} from '@/shared/validation/media.validation'

export const parseMediaUploadFormData = (formData: FormData): UploadMediaDTO => {
    const parsed = uploadMediaSchema.safeParse({
        file: formData.get('media'),
        options: formData.get('options')
    })

    console.log({ parsed })

    if (!parsed.success) {
        const errors = parsed.error.issues.map((issue) => issue.message)
        throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.NO_FILE, errors)
    }

    if (!parsed.data.options) {
        return { file: parsed.data.file, options: undefined }
    }

    let rawOptions: unknown
    try {
        rawOptions = JSON.parse(parsed.data.options)
    } catch {
        throw ApiError.BadRequest('Invalid media options JSON')
    }

    const parsedOptions = uploadMediaOptionsSchema.safeParse(rawOptions)
    if (!parsedOptions.success) {
        const errors = parsedOptions.error.issues.map((issue) => issue.message)
        throw ApiError.BadRequest('Invalid media options', errors)
    }

    return { file: parsed.data.file, options: parsedOptions.data }
}
