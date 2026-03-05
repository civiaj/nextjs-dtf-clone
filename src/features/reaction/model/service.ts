import { commentActions } from '@/entities/comment'
import { postActions } from '@/entities/post'
import { api } from '@/shared/api'
import { TResponseBase } from '@/shared/types'
import { TReactionMetrics } from '@/shared/types/reaction.types'
import { TUpdateReactionInput } from '@/shared/validation/reaction.schema'

export const reactionService = api.injectEndpoints({
    endpoints: (builder) => ({
        setReaction: builder.mutation<TResponseBase<TReactionMetrics>, TUpdateReactionInput>({
            query: (body) => ({
                url: '/reaction',
                body,
                method: 'POST',
                credentials: 'include'
            }),
            onQueryStarted: async (input, { dispatch, queryFulfilled }) => {
                const optimisticAction = buildOptimisticReactionAction(input)

                try {
                    dispatch(optimisticAction)
                    const reactions = (await queryFulfilled).data.result.reactions
                    const action = buildReactionAction(input, reactions)
                    dispatch(action)
                } catch {
                    dispatch(optimisticAction)
                }
            }
        })
    })
})

export const { useSetReactionMutation } = reactionService

const buildOptimisticReactionAction = ({
    reactionValueId,
    targetId,
    target
}: TUpdateReactionInput) => {
    switch (target) {
        case 'COMMENT':
            return commentActions.toggleReaction({ id: targetId, reactionValueId })
        case 'POST':
            return postActions.toggleReaction({ id: targetId, reactionValueId })
        default: {
            throw Error(`Unknown reaction target: ${target satisfies never}`)
        }
    }
}

const buildReactionAction = (
    input: TUpdateReactionInput,
    reactions: TReactionMetrics['reactions']
) => {
    switch (input.target) {
        case 'COMMENT':
            return commentActions.setReactions({ id: input.targetId, reactions })
        case 'POST':
            return postActions.setReactions({ id: input.targetId, reactions })
        default: {
            throw Error(`Unknown reaction target: ${input.target satisfies never}`)
        }
    }
}
