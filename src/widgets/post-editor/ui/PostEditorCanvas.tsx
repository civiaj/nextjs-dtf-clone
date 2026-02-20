import { memo } from 'react'
import { EditorData } from '@/entities/editor'
import { TPost } from '@/shared/types/post.types'
import { AddTitleButton } from './AddTitleButton'
import { useEditor } from '../model/hooks/useEditor'
import { processData } from '../model/utils'

const EDITOR_HOLDER_ID = 'post-editor'

type PostEditorCanvasProps = {
    blocks: TPost['blocks']
    onEditorChange: (data: EditorData) => void
}

export const PostEditorCanvas = memo(({ blocks, onEditorChange }: PostEditorCanvasProps) => {
    const initialData = processData(blocks)
    const { instance, isReady } = useEditor({
        holder: EDITOR_HOLDER_ID,
        onChange: onEditorChange,
        data: initialData
    })

    return (
        <>
            {isReady && (
                <AddTitleButton
                    instance={instance}
                    holder={EDITOR_HOLDER_ID}
                />
            )}
            <div id={EDITOR_HOLDER_ID} />
        </>
    )
})

PostEditorCanvas.displayName = 'PostEditorCanvas'
