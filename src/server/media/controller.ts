import { NextRequest, NextResponse } from 'next/server'
import { AuthContext } from '@/server/context'
import { TResponseBase } from '@/shared/types'
import { TMediaSelect } from '@/shared/types/media.types'
import { mediaService } from './container'
import { parseMediaUploadFormData } from './schema'

export class MediaController {
    static async upload(req: NextRequest): Promise<NextResponse<TResponseBase<TMediaSelect>>> {
        const formData = await req.formData()
        const dto = parseMediaUploadFormData(formData)

        const user = await AuthContext.getCurrentUser()
        const { result, status } = await mediaService.upload(dto, user.id)

        return NextResponse.json({ result, message: 'success' }, { status })
    }
}
