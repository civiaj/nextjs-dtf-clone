import { fetchSuggestions } from '@/entities/user'
import { createExtensions } from '@/shared/services/tiptap'

export const commentEditorExtensions = createExtensions({ mode: 'interactive', fetchSuggestions })
