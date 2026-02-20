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
import { DeletePostDropdownItem } from '@/features/delete-post'
import { EditPostDropdownItem } from '@/features/edit-post'
import { PostView, usePostData } from '@/features/post-content'
import { useAppSelector } from '@/lib/store'
import { PATH } from '@/shared/constants'
import { TPost } from '@/shared/types/post.types'
import { Container } from '@/shared/ui/box'
import { Button } from '@/shared/ui/button'
import { getSinceDate } from '@/shared/utils/date.utils'

export type DraftPostItemProps = {
    id: TPost['id']
    view: TPostEntityRenderView
}

export const DraftPostItem = memo(({ id, view }: DraftPostItemProps) => {
    const selectUser = useMemo(makeSelectUser, [])

    const { post, isNotFound } = usePostData(id)
    const user = useAppSelector((state) => selectUser(state, post?.user.id))

    if (view === 'full' && isNotFound) {
        return notFound()
    }
    if (view === 'full' && (!post || !user)) {
        return <PostEntitySkeleton view={view} />
    }
    if (!post || !user) return null

    return (
        <Container>
            <PostEntityHeader
                user={user}
                rightSlot={
                    <>
                        <Button
                            className='pointer-events-none border-yellow-400 bg-yellow-100'
                            variant={'active-light'}
                            size={'sm'}>
                            Черновик
                        </Button>
                        <PostEntityActionsDropdown
                            actions={({ onClose }) => (
                                <>
                                    <EditPostDropdownItem
                                        userId={user.id}
                                        postId={id}
                                    />
                                    <DeletePostDropdownItem
                                        userId={user.id}
                                        postId={id}
                                        onClose={onClose}
                                    />
                                </>
                            )}
                        />
                    </>
                }
                description={getSinceDate(post.updatedAt)}
            />
            <PostView
                view={view}
                href={`${PATH.DRAFT}/${post.id}`}
                blocks={post.blocks}
            />
        </Container>
    )
})

DraftPostItem.displayName = 'DraftPostItem'
