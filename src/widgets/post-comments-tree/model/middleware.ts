import { commentActions } from '@/entities/comment'
import { RootState } from '@/lib/store'
import listenerMiddleware from '@/lib/store/listenerMiddleware'
import { commentsTreeService } from './service'
import { commentsTreeActions } from './slice'

listenerMiddleware.startListening({
    matcher: commentsTreeService.endpoints.getPostComments.matchPending,
    effect: async ({ meta }, api) => {
        const state = (api.getState() as RootState).commentsTree
        const args = meta.arg.originalArgs

        const postId = args.postId
        const uiThreadId = args.uiThreadId

        const isContextChanged = state.postId !== postId || state.uiThreadId !== uiThreadId

        if (!isContextChanged) return

        api.dispatch(commentsTreeActions.setContext({ postId, uiThreadId }))
        api.dispatch(commentsTreeActions.resetTree())
        api.dispatch(commentActions.reset())
    }
})

listenerMiddleware.startListening({
    actionCreator: commentsTreeActions.setSortBy,
    effect: async (_, api) => {
        api.dispatch(commentsTreeActions.resetTree())
        api.dispatch(commentActions.reset())
    }
})
