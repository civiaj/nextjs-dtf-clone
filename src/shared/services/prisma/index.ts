export { default as prisma } from './instance'
export * from './select'
export { Prisma } from '@prisma/client'
export type {
    User,
    Media,
    Post,
    UserMediaUpload,
    Token,
    FollowUser,
    MutePost,
    MuteUser,
    Comment,
    ReactionComment,
    ReactionPost,
    ReactionValue
} from '@prisma/client'
