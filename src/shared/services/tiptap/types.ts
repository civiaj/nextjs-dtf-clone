import { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import { TUser } from '@/shared/types/user.types'

export type TFetchSuggestions = (query: string) => Promise<TUser[]>
export type MentionNodeAttrs = { id: string; name: string }
export type SuggestionListRef = {
    onKeyDown: NonNullable<ReturnType<NonNullable<SuggestionOptions<TUser>['render']>>['onKeyDown']>
}
export type SuggestionListProps = SuggestionProps<TUser>
export type TCreateExtensionsDeps =
    | { mode: 'interactive'; fetchSuggestions: TFetchSuggestions }
    | { mode: 'schema' }
