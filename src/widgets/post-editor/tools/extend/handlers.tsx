import { isCaretAtEndOfInput, isCaretAtStartOfInput } from '@editorjs/caret'
import { EditorBlockTool, ExtendedBlock } from '../../model/types'

export type BlockHandler = {
    onKeyDown?: (e: KeyboardEvent, tool: ExtendedBlock & EditorBlockTool) => void
    onPaste?: (e: ClipboardEvent, tool: ExtendedBlock & EditorBlockTool) => void
    onInput?: (e: InputEvent, tool: ExtendedBlock & EditorBlockTool) => void
    onRender?: (tool: ExtendedBlock & EditorBlockTool) => void
}

export const navigationHandler: BlockHandler = {
    onKeyDown(e, tool) {
        const isStart = isCaretAtStartOfInput(tool.element)
        const isEnd = isCaretAtEndOfInput(tool.element)

        const prevent = () => {
            e.preventDefault()
            e.stopPropagation()
        }

        if ((isEnd && (e.code === 'ArrowDown' || e.code === 'ArrowRight')) || e.code === 'Tab') {
            prevent()
            tool.actions.focusNext()
            return
        }

        if (isStart && (e.code === 'ArrowUp' || e.code === 'ArrowLeft')) {
            prevent()
            tool.actions.focusPrev()
            return
        }

        if (isStart && e.code === 'Backspace') {
            const index = tool.api.blocks.getBlockIndex(tool.block.id)
            const prev = tool.api.blocks.getBlockByIndex(index - 1)
            if (index === 1 && prev) {
                prevent()
            }
            return
        }
    }
}

export const slashMenuBehavior: BlockHandler = {
    onKeyDown(e, tool) {
        if (e.code === 'Slash') {
            if ((e.ctrlKey && !tool.meta.isEmpty) || tool.meta.isEmpty) {
                e.preventDefault()
                e.stopPropagation()
                tool.state.toggleOpenId(tool.block.id)
            }
        }
    }
}

export const maxCharsBehavior = ({
    limit,
    condition,
    dangerZone = 20,
    showThreshold = 50
}: {
    limit: number
    dangerZone?: number
    showThreshold?: number
    condition?: (tool: EditorBlockTool) => void
}): BlockHandler => {
    const updateChars = (el: HTMLElement) => {
        const len = getElementText(el).length
        const left = limit - len
        const isDanger = dangerZone ? left <= dangerZone : false
        const shouldShow = showThreshold ? left <= showThreshold : true

        if (isDanger) {
            el.parentElement?.classList.add('ce-chars--danger')
        } else {
            el.parentElement?.classList.remove('ce-chars--danger')
        }

        if (shouldShow) {
            el.parentElement?.classList.add('ce-chars')
            el.parentElement?.setAttribute('data-chars', String(Math.max(0, left)))
        } else {
            el.parentElement?.classList.remove('ce-chars')
            el.parentElement?.removeAttribute('data-chars')
        }
    }

    const getElementText = (el: HTMLElement): string => {
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
            return el.value
        }
        return el.textContent ?? ''
    }

    const isInCondition = (tool: EditorBlockTool) => {
        if (condition) return condition(tool)
        return true
    }

    return {
        onKeyDown(e, tool) {
            const len = getElementText(tool.element).length

            if (
                len >= limit &&
                e.key.length === 1 &&
                !e.ctrlKey &&
                !e.metaKey &&
                isInCondition(tool)
            ) {
                e.preventDefault()
                e.stopPropagation()
            }
        },
        onPaste(e, tool) {
            if (!isInCondition(tool)) return

            const clipboard = e.clipboardData
            if (!clipboard) return

            const text = clipboard.getData('text/plain') ?? ''

            if (
                tool.element instanceof HTMLInputElement ||
                tool.element instanceof HTMLTextAreaElement
            ) {
                const el = tool.element
                const { selectionStart = 0, selectionEnd = 0, value } = el

                const before = value.slice(0, selectionStart!)
                const after = value.slice(selectionEnd!)

                const len = value.length - (selectionEnd! - selectionStart!)
                const left = Math.max(0, limit - len)

                if (left <= 0) {
                    e.preventDefault()
                    e.stopPropagation()
                    updateChars(el)
                    return
                }

                if (text.length > left) {
                    e.preventDefault()
                    e.stopPropagation()

                    const truncated = text.slice(0, left)
                    el.value = before + truncated + after

                    const pos = before.length + truncated.length
                    el.selectionStart = el.selectionEnd = pos

                    el.dispatchEvent(
                        new InputEvent('input', {
                            bubbles: true,
                            data: truncated,
                            inputType: 'insertText'
                        })
                    )
                    updateChars(el)
                }

                return
            }

            const selection = window.getSelection()
            if (!selection?.rangeCount) return

            const range = selection.getRangeAt(0)

            range.deleteContents()

            const len = getElementText(tool.element).length
            const left = Math.max(0, limit - len)

            if (left <= 0) {
                e.preventDefault()
                e.stopPropagation()
                updateChars(tool.element)
                return
            }

            if (text.length > left) {
                e.preventDefault()
                e.stopPropagation()

                const truncated = text.slice(0, left)
                range.insertNode(document.createTextNode(truncated))
                range.collapse(false)
                selection.removeAllRanges()
                selection.addRange(range)
                updateChars(tool.element)
            } else {
                updateChars(tool.element)
            }
        },

        onInput(_, tool) {
            if (!isInCondition(tool)) return
            updateChars(tool.element)
        },

        onRender(tool) {
            if (!isInCondition(tool)) return
            updateChars(tool.element)
        }
    }
}
