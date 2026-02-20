'use client'

import { useCallback, useRef, useState } from 'react'
import { useSaveComment } from '@/entities/comment'
import {
    MediaAttachmentItem,
    MediaAttachmentUpload,
    MediaAttachmentUploadRef
} from '@/entities/media'
import { commentEditorExtensions } from '@/features/comment-editor'
import { MediaAppIcon } from '@/shared/icons'
import {
    TiptapEditorCore,
    TiptapEditorCoreRef,
    TiptapEditorShell,
    TiptapHint
} from '@/shared/services/tiptap'
import { TComment } from '@/shared/types/comment.types'
import { TMedia } from '@/shared/types/media.types'
import { TPost } from '@/shared/types/post.types'
import { Button } from '@/shared/ui/button'

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
    const uploadRef = useRef<MediaAttachmentUploadRef>(null)
    const editorRef = useRef<TiptapEditorCoreRef>(null)
    const [editorHasContent, setEditorHasContent] = useState(false)
    const [uploadedAttachments, setUploadedAttachments] = useState<TMedia[]>([])
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
        const mediaId = uploadedAttachments[0]?.id

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

    const handleRemoveFile = useCallback(
        (id: number) => setUploadedAttachments((prev) => prev.filter((item) => item.id !== id)),
        []
    )

    const handleFileUploadEnd = useCallback(
        (media: TMedia) =>
            setUploadedAttachments((prev) =>
                prev.some((item) => item.id === media.id) ? prev : [...prev, media]
            ),
        []
    )

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
                <MediaAttachmentUpload
                    max={1}
                    onRemove={handleRemoveFile}
                    onUploadEnd={handleFileUploadEnd}
                    ref={uploadRef}
                    uploadedSize={uploadedAttachments.length}>
                    <MediaAttachmentUpload.Uploaded>
                        {uploadedAttachments.map((media) => (
                            <MediaAttachmentItem
                                previewAvailable
                                key={media.id}
                                id={media.id}
                                type={media.type}
                                src={media.src}
                                height={media.height}
                                width={media.width}
                                blurDataURL={media.blurDataURL}
                                thumbnail={media.thumbnail}
                                duration={media.duration}
                            />
                        ))}
                    </MediaAttachmentUpload.Uploaded>
                </MediaAttachmentUpload>
            }
            leftControls={
                <>
                    <Button
                        onClick={() => uploadRef.current?.openFileInput()}
                        title='Прикрепить файл к комментарию'
                        aria-label='Прикрепить файл к комментарию'
                        size='icon-base'
                        variant='ghost'>
                        <MediaAppIcon size={18} />
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
