import { NextRequest, NextResponse } from 'next/server'
import { ApiError } from '@/lib/error'
import { commentService, postService, userService } from '@/server/composition-root'
import { AuthContext } from '@/server/context'
import { ERROR_MESSAGES } from '@/shared/constants'
import { TResponseBase } from '@/shared/types'
import { GetCommentsResponse, TComment } from '@/shared/types/comment.types'
import {
    createCommentSchema,
    createTestCommentsSchema,
    deleteCommentSchema,
    getCommentsSchema
} from '@/shared/validation/comment.schema'

export class CommentController {
    static async createOne(req: NextRequest): Promise<NextResponse<TResponseBase<TComment>>> {
        const body = await req.json()
        const dto = createCommentSchema.parse(body)
        const user = await AuthContext.getCurrentUser()
        const result = await commentService.createOne(dto, user.id)
        return NextResponse.json({ message: 'success', result })
    }

    static async getComments(req: NextRequest): Promise<NextResponse<GetCommentsResponse>> {
        const params = Object.fromEntries(req.nextUrl.searchParams.entries())
        const dto = getCommentsSchema.parse(params)
        const type = dto.type

        let result: { items: TComment[]; cursor: number | null } = { items: [], cursor: null }

        switch (type) {
            case 'user': {
                const user = await AuthContext.getCurrentUserOrNull()
                result = await commentService.getUserComments(dto, user?.id)
                break
            }
            case 'post': {
                const user = await AuthContext.getCurrentUserOrNull()
                result = await commentService.getPostComments(dto, user?.id)
                break
            }
            case 'thread': {
                const user = await AuthContext.getCurrentUserOrNull()
                result = await commentService.getPostThread(dto, user?.id)
                break
            }
            case 'bookmarks': {
                const user = await AuthContext.getCurrentUser()
                result = await commentService.getBookmarkedComments(dto, user.id)
                break
            }
            case 'reactions': {
                const user = await AuthContext.getCurrentUser()
                result = await commentService.getReactedComments(dto, user.id)
                break
            }
            default: {
                console.warn(`Invalid type: ${type satisfies never}`)
            }
        }

        return NextResponse.json({ message: 'success', result })
    }

    static async softDeleteOne(req: NextRequest): Promise<NextResponse<TResponseBase<TComment>>> {
        const body = await req.json()
        const dto = deleteCommentSchema.parse(body)
        const user = await AuthContext.getCurrentUser()
        const result = await commentService.softDeleteOne(dto, user.id)
        return NextResponse.json({ message: 'success', result })
    }

    static async _createTestComments(req: NextRequest): Promise<NextResponse<TResponseBase<null>>> {
        if (process.env.NODE_ENV !== 'development')
            throw ApiError.NotAllowed('This endpoint is available only in development mode')

        const params = Object.fromEntries(req.nextUrl.searchParams.entries())
        const dto = createTestCommentsSchema.parse(params)

        const [existedPost, existedUser] = await Promise.all([
            postService.getById(dto.postId, dto.userId),
            userService.getById(dto.userId, dto.userId)
        ])

        if (!existedPost) throw ApiError.NotFound(ERROR_MESSAGES.POST.NOT_FOUND)
        if (!existedUser) throw ApiError.NotFound(ERROR_MESSAGES.USER.NOT_FOUND)

        await commentService.deletePostComments(dto.postId)

        const getRandomCount = () => Math.floor(Math.random() * 11) + 5 // 5–10
        const rootLevelCount = getRandomCount()

        for (let i = 0; i < rootLevelCount; i++) {
            const root = await commentService.createOne(
                { postId: dto.postId, json: { type: 'text', text: `root ${i + 1}` } },
                dto.userId
            )
            const firstLevelCount = getRandomCount()
            for (let j = 0; j < firstLevelCount; j++) {
                const firstReply = await commentService.createOne(
                    {
                        postId: dto.postId,
                        parentId: root.id,
                        json: { type: 'text', text: `reply ${j + 1} to root ${i + 1}` }
                    },
                    dto.userId
                )
                const secondLevelCount = getRandomCount()
                for (let k = 0; k < secondLevelCount; k++) {
                    await commentService.createOne(
                        {
                            postId: dto.postId,
                            parentId: firstReply.id,
                            json: {
                                type: 'text',
                                text: `reply ${k + 1} to reply ${j + 1} of root ${i + 1}`
                            }
                        },
                        dto.userId
                    )
                }
            }
        }

        return NextResponse.json({ message: 'success', result: null })
    }
}
