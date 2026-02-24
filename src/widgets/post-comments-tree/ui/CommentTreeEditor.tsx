'use client'

import { useCallback, useRef, useState } from 'react'
import { useSaveComment } from '@/entities/comment'
import { MediaUploadField, MediaUploadFieldRef } from '@/entities/media'
import { commentEditorExtensions } from '@/features/comment-editor'
import { MediaAppIcon } from '@/shared/icons'
import {
    TiptapEditorCore,
    TiptapEditorCoreRef,
    TiptapEditorShell,
    TiptapHint
} from '@/shared/services/tiptap'
import { TComment } from '@/shared/types/comment.types'
import { TMediaWithCaption } from '@/shared/types/media.types'
import { TPost } from '@/shared/types/post.types'
import { Button } from '@/shared/ui/button'

const maxFiles = 1

export const CommentTreeEditor = ({
    onCancel,
    parentId = null,
    postId,
    onSuccess
}: {
    onCancel?: () => void
    onSuccess?: (comment: TComment) => void
    postId: TPost['id']
    parentId?: TComment['parentId']
}) => {
    const uploadRef = useRef<MediaUploadFieldRef>(null)
    const editorRef = useRef<TiptapEditorCoreRef>(null)
    const [editorHasContent, setEditorHasContent] = useState(false)
    const [uploadedAttachments, setUploadedAttachments] = useState<TMediaWithCaption[]>([])
    const { isLoading, execute: saveComment } = useSaveComment()

    const handleOnHasContentChange = useCallback((value: boolean) => {
        setEditorHasContent(value)
    }, [])

    const handleCommentEditorCancel = useCallback(() => {
        editorRef.current?.clear()
        setUploadedAttachments([])
        onCancel?.()
    }, [onCancel])

    const handleCommentSave = useCallback(() => {
        const doc = editorRef.current?.getJSON()
        if (!doc) return

        editorRef.current?.disable()
        const mediaId = uploadedAttachments[0]?.media.id

        saveComment(
            { parentId, postId, mediaId, json: JSON.stringify(doc) },
            {
                onFinally: () => {
                    editorRef.current?.enable()
                },
                onSuccess: (comment) => {
                    editorRef.current?.clear()
                    setUploadedAttachments([])
                    onSuccess?.(comment)
                }
            }
        )
    }, [saveComment, parentId, postId, uploadedAttachments, onSuccess])

    const canSaveComment = uploadedAttachments.length > 0 || editorHasContent

    return (
        <TiptapEditorShell
            editor={
                <TiptapEditorCore
                    ref={editorRef}
                    className='tiptap-editor'
                    extensions={commentEditorExtensions}
                    onHasContentChange={handleOnHasContentChange}
                    editable
                />
            }
            attachments={
                <MediaUploadField
                    ref={uploadRef}
                    values={uploadedAttachments}
                    onChange={setUploadedAttachments}
                    maxFiles={maxFiles}
                    showPicker={false}
                    allowDragAndDrop={false}
                />
            }
            leftControls={
                <>
                    <Button
                        disabled={uploadedAttachments.length === maxFiles}
                        onClick={() => uploadRef.current?.openFileDialog()}
                        title='Прикрепить файл к комментарию'
                        aria-label='Прикрепить файл к комментарию'
                        size='icon-base'
                        variant='ghost'>
                        <MediaAppIcon />
                    </Button>
                    <TiptapHint />
                </>
            }
            rightControls={
                <>
                    {onCancel && (
                        <Button
                            disabled={isLoading}
                            variant={'outline'}
                            size={'md'}
                            onClick={handleCommentEditorCancel}>
                            Отменить
                        </Button>
                    )}
                    {canSaveComment && (
                        <Button
                            disabled={isLoading}
                            variant={'blue'}
                            size={'md'}
                            onClick={handleCommentSave}>
                            Отправить
                        </Button>
                    )}
                </>
            }
        />
    )
}
