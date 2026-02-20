export { NEW_DRAFT_ID } from './constants'
export * from './model/service'
export { postReducer, postActions } from './model/slice'
export { makeSelectPost, makeSelectPostIsDeleted } from './model/selectors'

export { PostEntityActionsDropdown } from './ui/PostEntityActionsDropdown'
export { PostEntityHeader } from './ui/PostEntityHeader'
export { PostEntitySkeleton, PostEntityListSkeleton } from './ui/PostEntitySkeleton'
export type { TPostEntityRenderView } from './ui/PostEntitySkeleton'
