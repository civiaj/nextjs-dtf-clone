import { MediaContext } from '@prisma/client'
import { UploadMediaDTO } from '@/shared/validation/media.validation'

export const resolveMediaContext = (options?: UploadMediaDTO['options']): MediaContext => {
    if (!options || !options.context) return 'DEFAULT'
    return options.context
}
