import { useAppDispatch } from '@/lib/store'
import { Container } from '@/shared/ui/box'
import { useScrollToCommentsOnHash } from '../model/hooks/useScrollToCommentsOnHash'
import { commentsTreeActions } from '../model/slice'

export const CommentsTreeActionsWrapper = ({ children }: { children: React.ReactNode }) => {
    useScrollToCommentsOnHash()
    const dispatch = useAppDispatch()

    const handleCommentsTreeClickDelegation = (e: React.MouseEvent) => {
        const target = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-action]')
        if (!target) return

        const [action, id, parentId] = [
            'data-action',
            'data-comment-id',
            'data-comment-parent-id'
        ].map((attr) => target.getAttribute(attr))

        switch (action) {
            case 'reply': {
                if (!id) return
                dispatch(commentsTreeActions.toggleReplyTarget({ id: +id }))
                break
            }
            case 'highlight-parent': {
                if (!parentId) return
                dispatch(commentsTreeActions.requestScrollToNode({ id: +parentId }))
                break
            }
            case 'expand': {
                if (!id) return
                dispatch(commentsTreeActions.toggleRepliesExpansion({ id: +id }))
                break
            }
        }
    }

    return (
        <Container
            onClick={handleCommentsTreeClickDelegation}
            id='comments'
            className='scroll-mt-[var(--navbar-height)]'>
            {children}
        </Container>
    )
}
