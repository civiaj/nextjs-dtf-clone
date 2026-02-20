import { NextRequest, NextResponse } from 'next/server'
import { postService } from '@/server/composition-root'
import { AuthContext } from '@/server/context'
import { TResponseBase } from '@/shared/types'
import { TPost, TPostData } from '@/shared/types/post.types'
import {
    deletePostSchema,
    getPostSchema,
    getPostsSchema,
    publishPostSchema,
    updatePostSchema
} from '@/shared/validation/post.schema'

export class PostController {
    public static async getPost(
        req: NextRequest,
        params: object
    ): Promise<NextResponse<TResponseBase<TPost | null>>> {
        const dto = getPostSchema.parse(params)
        const user = await AuthContext.getCurrentUserOrNull()

        let result: TPost | null = null

        if (dto.id) {
            result = await postService.getById(dto.id, user?.id)
        } else if (dto.slug) {
            result = await postService.getBySlug(dto.slug, user?.id)
        }

        return NextResponse.json({ message: 'success', result })
    }

    public static async getPosts(
        req: NextRequest
    ): Promise<NextResponse<TResponseBase<{ items: TPost[]; cursor: number | null }>>> {
        const params = Object.fromEntries(req.nextUrl.searchParams.entries())
        const dto = getPostsSchema.parse(params)
        const type = dto.type
        let result: { items: TPost[]; cursor: number | null } = { items: [], cursor: null }

        switch (type) {
            case 'users': {
                const user = await AuthContext.getCurrentUserOrNull()
                result = await postService.getUserPosts(dto, user?.id)
                break
            }
            case 'feed': {
                const user = await AuthContext.getCurrentUserOrNull()
                result = await postService.getFeedPosts(dto, user?.id)
                break
            }
            case 'owner-drats': {
                const user = await AuthContext.getCurrentUser()
                result = await postService.getOwnerDrafts(dto, user.id)
                break
            }
            case 'owner-bookmarks': {
                const user = await AuthContext.getCurrentUser()
                result = await postService.getOwnerBookmarkedPosts(dto, user.id)
                break
            }
            case 'owner-reactions': {
                const user = await AuthContext.getCurrentUser()
                result = await postService.getOwnerReactedPosts(dto, user.id)
                break
            }
            case 'owner-muted-posts': {
                const user = await AuthContext.getCurrentUser()
                result = await postService.getOwnerMutedPosts(dto, user.id)
                break
            }
            default: {
                console.warn(`Unknown type: ${type satisfies never}`)
            }
        }

        return NextResponse.json({ message: 'success', result })
    }

    public static async publish(req: NextRequest): Promise<NextResponse<TResponseBase<TPost>>> {
        const body = await req.json()
        const dto = publishPostSchema.parse(body)
        const user = await AuthContext.getCurrentUser()
        const result = await postService.publish(dto, user.id)
        return NextResponse.json({ result, message: 'success' })
    }

    public static async update(req: NextRequest): Promise<NextResponse<TResponseBase<TPostData>>> {
        const body = await req.json()
        const dto = updatePostSchema.parse(body)
        const user = await AuthContext.getCurrentUser()
        const result = await postService.updateOne(dto, user.id)
        return NextResponse.json({ result, message: 'success' })
    }

    public static async delete(req: NextRequest): Promise<NextResponse<TResponseBase<TPost>>> {
        const params = Object.fromEntries(req.nextUrl.searchParams.entries())
        const dto = deletePostSchema.parse(params)
        const user = await AuthContext.getCurrentUser()
        const result = await postService.deleteOne(dto, user.id)
        return NextResponse.json({ result, message: 'success' })
    }
}
