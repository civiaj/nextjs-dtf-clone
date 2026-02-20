import { useContext } from 'react'
import { ReactionBarContext } from './context'

export const useReactionBarContext = () => {
    const context = useContext(ReactionBarContext)
    if (!context) {
        throw new Error('useReactionBarContext must be used within a ReactionBarContextProvider')
    }

    return context
}
