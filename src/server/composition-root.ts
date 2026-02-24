import {
    BookmarkCommentRepository,
    BookmarkPostRepository,
    BookmarkService
} from '@/server/bookmark'
import { CommentEnricher, CommentRepository, CommentService } from '@/server/comment'
import { FollowUserRepository, FollowUserService } from '@/server/follow-user'
import { MutePostRepository, MuteService, MuteUserRepository } from '@/server/mute'
import { PostEnricher, PostRepository } from '@/server/post'
import { PostService } from '@/server/post/service'
import {
    ReactionCommentRepository,
    ReactionPostRepository,
    ReactionService,
    ReactionValueRepository
} from '@/server/reaction'
import { TokenRepository, TokenService } from '@/server/token'
import { UserEnricher, UserService } from '@/server/user'
import { UserRepository } from '@/server/user/repository'

// repositories
const bookmarkCommentRepository = new BookmarkCommentRepository()
const bookmarkPostRepository = new BookmarkPostRepository()
const commentRepository = new CommentRepository()
const followUserRepository = new FollowUserRepository()
const mutePostRepository = new MutePostRepository()
const muteUserRepository = new MuteUserRepository()
const postRepository = new PostRepository()
const reactionCommentRepository = new ReactionCommentRepository()
const reactionPostRepository = new ReactionPostRepository()
const reactionValueRepository = new ReactionValueRepository()
const tokenRepository = new TokenRepository()
const userRepository = new UserRepository()

//services
const muteService = new MuteService({ POST: mutePostRepository, USER: muteUserRepository })
const followUserService = new FollowUserService(followUserRepository)
const reactionService = new ReactionService(
    { COMMENT: reactionCommentRepository, POST: reactionPostRepository },
    reactionValueRepository
)
const bookmarkService = new BookmarkService({
    COMMENT: bookmarkCommentRepository,
    POST: bookmarkPostRepository
})
const userEnricher = new UserEnricher(followUserService, muteService)
const userService = new UserService(userRepository, muteService, followUserService, userEnricher)
const commentEnricher = new CommentEnricher(
    followUserService,
    muteService,
    reactionService,
    bookmarkService
)
const commentService = new CommentService(
    commentRepository,
    bookmarkService,
    reactionService,
    userService,
    commentEnricher
)
const postEnricher = new PostEnricher(
    followUserService,
    muteService,
    commentService,
    reactionService,
    bookmarkService
)
const postService = new PostService(
    postRepository,
    bookmarkService,
    reactionService,
    muteService,
    postEnricher
)
const tokenService = new TokenService(tokenRepository)

export {
    followUserService,
    userEnricher,
    userService,
    reactionService,
    postService,
    commentService,
    tokenService,
    bookmarkService,
    muteService
}
export { mediaService } from '@/server/media'
