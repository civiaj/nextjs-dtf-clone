'use client'

import { computePosition, flip, shift } from '@floating-ui/dom'
import type { MentionOptions } from '@tiptap/extension-mention'
import { Editor, posToDOMRect, ReactRenderer } from '@tiptap/react'
import SuggestionList from './SuggestionList'
import { SuggestionListRef, TFetchSuggestions } from '../types'

export const createSuggestion = (
    fetchSuggestions: TFetchSuggestions
): MentionOptions['suggestion'] => ({
    items: async ({ query }) => {
        return await fetchSuggestions(query)
    },

    render: () => {
        let component: ReactRenderer<SuggestionListRef> | undefined

        return {
            onStart: (props) => {
                component = new ReactRenderer(SuggestionList, {
                    props,
                    editor: props.editor
                })

                if (!props.clientRect) {
                    return
                }

                component.element.style.position = 'absolute'
                document.body.appendChild(component.element)
                updatePosition(props.editor, component.element)
            },

            onUpdate(props) {
                component?.updateProps(props)
                if (component?.element) {
                    updatePosition(props.editor, component.element)
                }
            },

            onKeyDown(props) {
                if (props.event.key === 'Escape') {
                    component?.destroy()
                    return true
                }

                if (!component?.ref) {
                    return false
                }

                return component.ref.onKeyDown(props)
            },

            onExit() {
                component?.element.remove()
                component?.destroy()
                component = undefined
            }
        }
    }
})

const updatePosition = (editor: Editor, element: HTMLElement) => {
    const virtualElement = {
        getBoundingClientRect: () =>
            posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to)
    }

    computePosition(virtualElement, element, {
        placement: 'bottom-start',
        strategy: 'absolute',
        middleware: [shift(), flip()]
    }).then(({ x, y, strategy }) => {
        element.style.width = 'max-content'
        element.style.position = strategy
        element.style.left = `${x}px`
        element.style.top = `${y}px`
    })
}
