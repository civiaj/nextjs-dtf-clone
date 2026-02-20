'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { EditorContent, JSONContent, useEditor } from '@tiptap/react'
import { textStyles } from '@/shared/ui/text'
import { TiptapEditorCoreProps, TiptapEditorCoreRef } from './types'

export const TiptapEditorCore = forwardRef<TiptapEditorCoreRef, TiptapEditorCoreProps>(
    (
        { extensions, className, content = '', editable = true, onHasContentChange, onUpdate },
        ref
    ) => {
        const lastHasContentRef = useRef(false)

        const editor = useEditor({
            extensions,
            content,
            editable,
            immediatelyRender: false,
            onTransaction: ({ editor }) => {
                const hasContent = !editor.isEmpty
                if (hasContent !== lastHasContentRef.current) {
                    lastHasContentRef.current = hasContent
                    onHasContentChange?.(hasContent)
                }
            },
            onUpdate: ({ editor }) => {
                onUpdate?.(editor.getJSON())
            }
        })

        useImperativeHandle(ref, () => ({
            clear: () => editor?.commands.clearContent(),
            getJSON: () => editor?.getJSON(),
            disable: () => editor?.setEditable(false),
            enable: () => editor?.setEditable(true),
            setContent: (nextContent: JSONContent) => editor?.commands.setContent(nextContent),
            _setContent: (nextContent: JSONContent) => editor?.commands.setContent(nextContent)
        }))

        return (
            <EditorContent
                editor={editor}
                className={textStyles({ as: 'p', className })}
            />
        )
    }
)

TiptapEditorCore.displayName = 'TiptapEditorCore'
