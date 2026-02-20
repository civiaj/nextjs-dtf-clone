import { NextRequest, NextResponse } from 'next/server'
import { bookmarkService } from '@/server/composition-root'
import { AuthContext } from '@/server/context'
import { TResponseBase } from '@/shared/types'
import { updateBookmarkSchema } from '@/shared/validation/bookmark.schema'

export class BookmarkController {
    public static async update(req: NextRequest): Promise<NextResponse<TResponseBase<null>>> {
        const body = await req.json()
        const data = updateBookmarkSchema.parse(body)
        const user = await AuthContext.getCurrentUser()
        await bookmarkService.update({ target: data.target, targetId: data.id, userId: user.id })
        return NextResponse.json({ message: 'success', result: null })
    }
}
