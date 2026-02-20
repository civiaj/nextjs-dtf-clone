import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from '@/lib/error'
import { mediaService } from '@/server/composition-root'
import { AuthContext } from '@/server/context'
import { ERROR_MESSAGES } from '@/shared/constants'
import { TResponseBase } from '@/shared/types'
import { TMedia } from '@/shared/types/media.types'
import { mediaUploadSchema } from '@/shared/validation/media/mediaSchema'
import validateImageFile from './validation/validateImageFile'
import { validateVideoFile } from './validation/validateVideoFile'

export class MediaController {
    static async upload(req: NextRequest): Promise<NextResponse<TResponseBase<TMedia>>> {
        const formData = await req.formData()
        const { success, data } = mediaUploadSchema.safeParse({
            file: formData.get('media'),
            options: formData.get('options')
        })

        if (!success) throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.NO_FILE)

        const { file, options } = data
        await this.validateFile(file)

        const user = await AuthContext.getCurrentUser()
        const { result, status } = await mediaService.upload(user.id, file, options)

        return NextResponse.json({ result, message: 'success' }, { status })
    }

    static async uploadLink() {}

    private static async validateFile(file: File) {
        if (file.type.startsWith('image')) {
            await validateImageFile(file)
        } else if (file.type.startsWith('video')) {
            await validateVideoFile(file)
        } else throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.WRONG_FORMAT(file.type))
    }
}
