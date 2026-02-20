import { Extensions, mergeAttributes } from '@tiptap/core'
import Blockquote from '@tiptap/extension-blockquote'
import Document from '@tiptap/extension-document'
import Link from '@tiptap/extension-link'
import Mention from '@tiptap/extension-mention'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { Placeholder } from '@tiptap/extensions'
import { InputRule } from '@tiptap/react'
import { PATH } from '@/shared/constants'
import { createSuggestion } from './MentionSuggestion/configuration'
import { TCreateExtensionsDeps } from './types'

export const createExtensions = (deps: TCreateExtensionsDeps): Extensions => {
    return [
        Document,
        Paragraph,
        Text,
        Mention.extend({
            addAttributes() {
                return {
                    name: {
                        default: null,
                        parseHTML: (element) => {
                            return {
                                name: element.getAttribute('data-mention-name')
                            }
                        },
                        renderHTML: (attributes) => {
                            if (!attributes.name) {
                                return {}
                            }
                            return {
                                'data-mention-name': attributes.name
                            }
                        }
                    },
                    id: {
                        default: null,
                        parseHTML: (element) => {
                            return {
                                id: element.getAttribute('data-mention-id')
                            }
                        },
                        renderHTML: (attributes) => {
                            if (!attributes.id) {
                                return {}
                            }
                            return {
                                'data-mention-id': attributes.id
                            }
                        }
                    }
                }
            }
        }).configure({
            HTMLAttributes: {},
            renderHTML({ options, node }) {
                return [
                    'a',
                    mergeAttributes(
                        { href: `${PATH.USER}/${node.attrs.id}` },
                        options.HTMLAttributes
                    ),
                    `@${node.attrs.name ?? node.attrs.id}`
                ]
            },
            suggestion:
                deps.mode === 'interactive' ? createSuggestion(deps.fetchSuggestions) : undefined
        }),
        Blockquote.extend({
            content: 'paragraph*',
            addKeyboardShortcuts: () => ({ 'Control-Shift-B': () => false }),
            addInputRules() {
                return [
                    new InputRule({
                        find: /^>\s?(.*)$/,
                        undoable: false,
                        handler: ({ range, match, commands }) => {
                            const [, text] = match
                            commands.deleteRange(range)
                            commands.wrapIn(this.type)
                            if (text) {
                                commands.insertContent(text)
                            }
                        }
                    })
                ]
            }
        }),
        Placeholder.configure({ placeholder: 'Комментарий...' }),
        Link.configure({
            autolink: true,
            openOnClick: false,
            enableClickSelection: false,
            defaultProtocol: 'https',
            protocols: ['http', 'https']
        })
    ]
}
