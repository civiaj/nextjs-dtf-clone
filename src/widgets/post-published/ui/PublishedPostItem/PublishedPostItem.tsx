'use client'

import { memo, useMemo } from 'react'
import { notFound } from 'next/navigation'
import {
    PostEntityActionsDropdown,
    PostEntityHeader,
    PostEntitySkeleton,
    TPostEntityRenderView
} from '@/entities/post'
import { makeSelectUser } from '@/entities/user'
import { UpdateBookmarkMetricsButton } from '@/features/bookmark'
import { DeletePostDropdownItemWithModal } from '@/features/delete-post'
import { EditPostDropdownItem } from '@/features/edit-post'
import { ReactionBar } from '@/features/facades/reaction-entity'
import { FollowUserButton } from '@/features/follow-user'
import { MutePostDropdownItem } from '@/features/mute'
import { PostView, usePostData } from '@/features/post-content'
import { useAppSelector } from '@/lib/store'
import { PATH } from '@/shared/constants'
import { TPost } from '@/shared/types/post.types'
import { Container, ContainerPadding } from '@/shared/ui/box'
import { getSinceDate } from '@/shared/utils/date.utils'
import { PublishedPostCommentsButton } from './PublishedPostCommentsButton'
import { PublishedPostEditedIndicator } from './PublishedPostEditedIndicator'
import { PublishedPostShareDropdown } from './PubslishedPostShareButton'

export type PublishedPostItemProps = {
    id: TPost['id']
    initialData?: TPost
    view: TPostEntityRenderView
}

export const PublishedPostItem = memo(({ id, view, initialData }: PublishedPostItemProps) => {
    const selectUser = useMemo(makeSelectUser, [])

    const { post, isNotFound } = usePostData(id, { serverData: initialData })
    const user = useAppSelector((state) => selectUser(state, post?.user.id)) ?? initialData?.user

    if (view === 'full' && isNotFound) {
        return notFound()
    }
    if (view === 'full' && (!post || !post.publishedAt || !user)) {
        return <PostEntitySkeleton view={view} />
    }
    if (!post || !post.publishedAt || !user) return null

    return (
        <Container>
            <PostEntityHeader
                user={user}
                rightSlot={
                    <>
                        <FollowUserButton
                            id={user.id}
                            isActive={user.isFollowed}
                            size={'sm'}
                            variant={'active-light'}
                        />
                        <PostEntityActionsDropdown
                            actions={({ onClose }) => (
                                <>
                                    <EditPostDropdownItem
                                        userId={user.id}
                                        postId={id}
                                    />
                                    <MutePostDropdownItem
                                        userId={user.id}
                                        id={id}
                                        onCloseDropdown={onClose}
                                    />
                                    <DeletePostDropdownItemWithModal
                                        userId={user.id}
                                        postId={id}
                                        onClose={onClose}
                                    />
                                </>
                            )}
                        />
                    </>
                }
                description={getSinceDate(post.publishedAt)}
                descriptionExtra={
                    <PublishedPostEditedIndicator
                        publishedAt={post.publishedAt}
                        updatedAt={post.updatedAt}
                    />
                }
            />
            <PostView
                view={view}
                href={`${PATH.POST}/${post.slug}`}
                blocks={post.blocks}
            />
            <ContainerPadding smallMargin>
                <ReactionBar
                    size='md'
                    id={post.id}
                    target='POST'
                    reactions={post.reactions}
                />
            </ContainerPadding>
            <ContainerPadding
                smallMargin
                className='flex gap-1 sm:gap-2'>
                <PublishedPostCommentsButton
                    commentCount={post.commentCount}
                    slug={post.slug}
                />
                <UpdateBookmarkMetricsButton
                    count={post.bookmarkCount}
                    id={post.id}
                    isActive={post.isBookmarked}
                    target='POST'
                />
                <PublishedPostShareDropdown slug={post.slug} />
            </ContainerPadding>
        </Container>
    )
})

PublishedPostItem.displayName = 'PublishedPostItem'
