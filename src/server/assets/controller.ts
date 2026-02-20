import { NextRequest, NextResponse } from 'next/server'
import { reactionService } from '@/server/composition-root'
import { TResponseBase } from '@/shared/types'
import { TReactionAssets } from '@/shared/types/reaction.types'

export class AssetsController {
    static async getAll(
        _req: NextRequest
    ): Promise<NextResponse<TResponseBase<{ reactions: TReactionAssets }>>> {
        const [items, defaultValue] = await Promise.all([
            reactionService.getAssets(),
            reactionService.getDefaultReaction()
        ])

        return NextResponse.json({
            result: { reactions: { items, defaultValue } },
            message: 'success'
        })
    }
}
