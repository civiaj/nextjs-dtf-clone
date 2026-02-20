import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNavigationGuard } from 'next-navigation-guard'
import { EditorData, usePublishMutation, useUpdateMutation } from '@/entities/editor'
import { NEW_DRAFT_ID } from '@/entities/post'
import { formatErrorMessage } from '@/lib/error'
import { TPost } from '@/shared/types/post.types'
import { ContainerPadding } from '@/shared/ui/box'
import { Button } from '@/shared/ui/button'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { showToast } from '@/shared/ui/toaster'
import { DraftEditorStatus } from './DraftEditorStatus'
import { PostEditorCanvas } from './PostEditorCanvas'

type DraftPostEditorProps = {
    post?: TPost
    editorId: number
}

export const DraftPostEditor = ({ post, editorId }: DraftPostEditorProps) => {
    const router = useRouter()
    const initialBlocks = post?.blocks ?? []

    const [isNavigatingAway, setIsNavigatingAway] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [isEditorEmpty, setIsEditorEmpty] = useState(initialBlocks.length === 0)

    const [updateDraft, { isLoading: isSaving }] = useUpdateMutation()
    const [publishDraft, { isLoading: isPublishing }] = usePublishMutation()

    const currentEditorIdRef = useRef(editorId)
    const isCreatingDraftRef = useRef(false)

    useEffect(() => {
        currentEditorIdRef.current = editorId
    }, [editorId])

    const handleEditorChange = useCallback(
        async (data: EditorData) => {
            const isEmpty = data.blocks.length === 0
            setIsEditorEmpty(isEmpty)
            setHasUnsavedChanges(true)

            if (isEmpty) return

            const isCreatingNewDraft = currentEditorIdRef.current === NEW_DRAFT_ID

            if (isCreatingNewDraft && isCreatingDraftRef.current) {
                return
            }

            if (isCreatingNewDraft) {
                isCreatingDraftRef.current = true
            }

            try {
                const currentEditorId = currentEditorIdRef.current
                const response = await updateDraft({
                    id: currentEditorId,
                    data
                }).unwrap()

                if (currentEditorId === NEW_DRAFT_ID) {
                    currentEditorIdRef.current = response.result.id
                    router.replace(`/editor?id=${response.result.id}`)
                }
            } catch (error) {
                showToast('warning', { description: formatErrorMessage(error) })
            } finally {
                if (isCreatingNewDraft) {
                    isCreatingDraftRef.current = false
                }
            }
        },
        [router, updateDraft]
    )

    const handlePublish = useCallback(async () => {
        const shouldPublish = window.confirm('Опубликовать пост?')

        if (!shouldPublish || editorId === NEW_DRAFT_ID) return

        setIsNavigatingAway(true)

        try {
            const response = await publishDraft({ id: editorId }).unwrap()
            router.replace(`/post/${response.result.slug}`)
        } catch (error) {
            setIsNavigatingAway(false)
            showToast('warning', { description: formatErrorMessage(error) })
        }
    }, [editorId, publishDraft, router])

    useNavigationGuard({
        enabled: hasUnsavedChanges && editorId !== NEW_DRAFT_ID && !isNavigatingAway,
        confirm: () => {
            showToast('success', { description: 'Пост сохранен в черновики' })
            return true
        }
    })

    const isPublishDisabled =
        isNavigatingAway || isSaving || isPublishing || !editorId || isEditorEmpty

    return (
        <>
            <ScrollArea
                type='always'
                className='flex-1'>
                <ContainerPadding
                    smallMargin
                    withBottom>
                    <PostEditorCanvas
                        onEditorChange={handleEditorChange}
                        blocks={initialBlocks}
                    />
                </ContainerPadding>
            </ScrollArea>

            <ContainerPadding className='flex items-center gap-4 border-t border-border'>
                <Button
                    onClick={handlePublish}
                    disabled={isPublishDisabled}
                    size={'base'}
                    variant={'active'}>
                    Опубликовать
                </Button>

                <DraftEditorStatus
                    hasChanges={hasUnsavedChanges}
                    isSaving={isSaving}
                    isPublishing={isPublishing}
                    isNavigatingAway={isNavigatingAway}
                    isEmpty={isEditorEmpty}
                />
            </ContainerPadding>
        </>
    )
}
