import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNavigationGuard } from 'next-navigation-guard'
import { EditorData, useUpdateMutation } from '@/entities/editor'
import { NEW_DRAFT_ID } from '@/entities/post'
import { formatErrorMessage } from '@/lib/error'
import { TPost } from '@/shared/types/post.types'
import { ContainerPadding } from '@/shared/ui/box'
import { Button } from '@/shared/ui/button'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { showToast } from '@/shared/ui/toaster'
import { PostEditorCanvas } from './PostEditorCanvas'

type PublishedPostEditorProps = {
    post?: TPost
    editorId: number
}

export const PublishedPostEditor = ({ post, editorId }: PublishedPostEditorProps) => {
    const router = useRouter()
    const initialBlocks = post?.blocks ?? []

    const [isNavigatingAway, setIsNavigatingAway] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [isEditorEmpty, setIsEditorEmpty] = useState(initialBlocks.length === 0)
    const [pendingData, setPendingData] = useState<EditorData | null>(null)

    const [savePublishedPost, { isLoading: isSaving }] = useUpdateMutation()

    const handleEditorChange = useCallback((data: EditorData) => {
        setIsEditorEmpty(data.blocks.length === 0)
        setHasUnsavedChanges(true)
        setPendingData(data)
    }, [])

    const handleSaveChanges = useCallback(async () => {
        if (!pendingData) return

        setIsNavigatingAway(true)

        try {
            const response = await savePublishedPost({ id: editorId, data: pendingData }).unwrap()
            router.replace(`/post/${response.result.slug}`)
        } catch (error) {
            setIsNavigatingAway(false)
            showToast('warning', { description: formatErrorMessage(error) })
        }
    }, [editorId, pendingData, router, savePublishedPost])

    useNavigationGuard({
        enabled: hasUnsavedChanges && editorId !== NEW_DRAFT_ID && !isNavigatingAway,
        confirm: () => window.confirm('Изменения будут потеряны. Продолжить?')
    })

    const isSaveDisabled =
        isNavigatingAway || isSaving || !editorId || isEditorEmpty || !hasUnsavedChanges

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
                    onClick={handleSaveChanges}
                    disabled={isSaveDisabled}
                    size={'base'}
                    variant={'active'}>
                    Сохранить изменения
                </Button>
            </ContainerPadding>
        </>
    )
}
