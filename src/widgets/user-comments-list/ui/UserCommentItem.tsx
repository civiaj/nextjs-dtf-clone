import { memo, useMemo } from 'react'
import Link from 'next/link'
import { CommentItem, makeSelectComment } from '@/entities/comment'
import { makeSelectUser } from '@/entities/user'
import { UpdateBookmarkDropdownItem } from '@/features/bookmark'
import { commentEditorExtensions } from '@/features/comment-editor'
import { CopyUrlDropdownItem } from '@/features/copy-url-dropdown-item'
import { DeleteCommentDropdownItem } from '@/features/delete-comment'
import { ReactionBar } from '@/features/facades/reaction-entity'
import { MuteUserDropdownItem } from '@/features/mute'
import { useAppSelector } from '@/lib/store'
import { PATH } from '@/shared/constants'
import { CommentView } from '@/shared/services/tiptap'
import { TComment } from '@/shared/types/comment.types'
import { Container, ContainerPadding } from '@/shared/ui/box'
import { Button } from '@/shared/ui/button'
import { getNoun } from '@/shared/utils/string.utils'

export const UserCommentItem = memo(({ id }: { id: TComment['id'] }) => {
    const selectComment = useMemo(makeSelectComment, [])
    const selectUser = useMemo(makeSelectUser, [])

    const comment = useAppSelector((state) => selectComment(state, id))
    const user = useAppSelector((state) => selectUser(state, comment?.user.id))

    if (!comment || !user) return null

    const commentUrl = `${process.env.NEXT_PUBLIC_APP_URL}${PATH.POST}/${comment.post.slug}?thread=${comment.id}`

    return (
        <Container>
            <ContainerPadding>
                <CommentItem
                    comment={comment}
                    user={user}
                    dropdownActions={() => (
                        <>
                            <CopyUrlDropdownItem url={commentUrl} />
                            <UpdateBookmarkDropdownItem
                                id={comment.id}
                                isActive={comment.isBookmarked}
                                target='COMMENT'
                            />
                            <MuteUserDropdownItem
                                id={user.id}
                                isActive={user.isMuted}
                            />
                            <DeleteCommentDropdownItem
                                isDeleted={comment.isDeleted}
                                id={comment.id}
                                userId={user.id}
                            />
                        </>
                    )}
                    body={
                        <CommentView
                            extensions={commentEditorExtensions}
                            json={comment.json}
                            media={comment.media}
                        />
                    }
                    footer={
                        <>
                            <ReactionBar
                                className='mt-2'
                                id={comment.id}
                                reactions={comment.reactions}
                                size='sm'
                                target='COMMENT'
                            />
                            <div className='mt-2 flex gap-2'>
                                <Link href={commentUrl}>
                                    <Button
                                        size={'md'}
                                        padding={'tight'}
                                        variant={'clean'}>
                                        Ответить
                                    </Button>
                                </Link>
                                {comment.replyCount > 0 && (
                                    <Link href={commentUrl}>
                                        <Button
                                            size={'md'}
                                            padding={'tight'}
                                            variant={'clean-active'}>
                                            {`${comment.replyCount} ${getNoun(comment.replyCount, 'ответ', 'ответа', 'ответов')}`}
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </>
                    }
                />
            </ContainerPadding>
        </Container>
    )
})
UserCommentItem.displayName = 'UserCommentItem'
