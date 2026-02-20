import { TPost } from '@/shared/types/post.types'
import { GetPostCommentsInput, GetPostThreadInput } from '@/shared/validation/comment.schema'

export type PostCommentsTreeProps = { postId: TPost['id'] }

export type CommentsTreeRegularModeProps = PostCommentsTreeProps
export type TThreadId = number
export type CommentsTreeThreadModeProps = PostCommentsTreeProps & { threadId: TThreadId }

export type GetPostCommentsClientArgs = GetPostCommentsInput & { uiThreadId: number | null }
export type GetPostThreadClientArgs = GetPostThreadInput & { uiThreadId: number | null }
export type GetPostCommentsClientQueryArgs = GetPostCommentsClientArgs | GetPostThreadClientArgs
