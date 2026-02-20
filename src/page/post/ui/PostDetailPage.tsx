import { TPost } from '@/shared/types/post.types'
import { ErrorMessage } from '@/shared/ui/error-message'
import { CommentsTree } from '@/widgets/post-comments-tree'
import { PublishedPostItem } from '@/widgets/post-published'

export const PostDetailPage = async ({ serverPost }: { serverPost: TPost | null }) => {
    if (!serverPost) {
        return (
            <ErrorMessage
                variant='container'
                error={{ data: { message: 'Страница не найдена.' } }}
            />
        )
    }

    return (
        <>
            <PublishedPostItem
                initialData={serverPost}
                id={serverPost.id}
                view='full'
            />
            <CommentsTree
                postId={serverPost.id}
                fallbackCommentCount={serverPost.commentCount}
            />
        </>
    )
}
