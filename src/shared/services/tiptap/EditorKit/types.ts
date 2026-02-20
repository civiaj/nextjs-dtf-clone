import { Extensions, JSONContent } from '@tiptap/react'

export type TiptapEditorCoreProps = {
    extensions: Extensions
    className?: string
    content?: JSONContent | string
    editable?: boolean
    onHasContentChange?: (hasContent: boolean) => void
    onUpdate?: (json: JSONContent) => void
}

export type TiptapEditorCoreRef = {
    clear: () => void
    getJSON: () => JSONContent | undefined
    setContent: (content: JSONContent) => void
    _setContent: (content: JSONContent) => void
    disable: () => void
    enable: () => void
}

export type TiptapHintItem = {
    symbol: string
    title: string
    description: React.ReactNode
}

export type TiptapHintProps = {
    triggerTitle?: string
    triggerAriaLabel?: string
}

export type TiptapEditorShellProps = {
    editor: React.ReactNode
    attachments?: React.ReactNode
    leftControls?: React.ReactNode
    rightControls?: React.ReactNode
    className?: string
}
