'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { NEW_DRAFT_ID, useGetPostQuery } from '@/entities/post'
import { useAppSelector } from '@/lib/store'
import { PATH } from '@/shared/constants'
import { LoadingDots } from '@/shared/ui/loading-indicator'
import { parseId } from '@/shared/utils/common.utils'
import { DraftPostEditor } from './DraftPostEditor'
import { PostEditorHeader } from './PostEditorHeader'
import { PublishedPostEditor } from './PublishedPostEditor'
import './_.css'

const buildDraftSessionKey = (resetToken: string) => `draft-${resetToken || 'default'}`

export const PostEditor = () => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const currentUser = useAppSelector((state) => state.auth.currentUser)
    const [isVisible, setIsVisible] = useState(false)
    const [hasHandledQueryError, setHasHandledQueryError] = useState(false)

    const editorIdFromParams = parseId(searchParams.get('id')) ?? NEW_DRAFT_ID
    const resetToken = searchParams.get('reset') ?? ''

    const [isCreationFlow, setIsCreationFlow] = useState(editorIdFromParams === NEW_DRAFT_ID)
    const [draftSessionKey, setDraftSessionKey] = useState(() => buildDraftSessionKey(resetToken))

    const prevEditorIdRef = useRef(editorIdFromParams)
    const prevResetTokenRef = useRef(resetToken)

    useEffect(() => {
        const prevEditorId = prevEditorIdRef.current
        const prevResetToken = prevResetTokenRef.current

        const enteredNewDraft =
            editorIdFromParams === NEW_DRAFT_ID &&
            (prevEditorId !== NEW_DRAFT_ID || resetToken !== prevResetToken)

        if (enteredNewDraft) {
            setIsCreationFlow(true)
            setDraftSessionKey(buildDraftSessionKey(resetToken))
        }

        const switchedBetweenExistingPosts =
            prevEditorId !== NEW_DRAFT_ID &&
            editorIdFromParams !== NEW_DRAFT_ID &&
            editorIdFromParams !== prevEditorId

        if (switchedBetweenExistingPosts) {
            setIsCreationFlow(false)
        }

        prevEditorIdRef.current = editorIdFromParams
        prevResetTokenRef.current = resetToken
    }, [editorIdFromParams, resetToken])

    const shouldSkipQuery = isCreationFlow || !currentUser

    const { data, isLoading, isFetching, isError } = useGetPostQuery(editorIdFromParams, {
        skip: shouldSkipQuery,
        refetchOnMountOrArgChange: true
    })

    useEffect(() => {
        setIsVisible(true)
    }, [])

    useEffect(() => {
        if (isError && !hasHandledQueryError) {
            setHasHandledQueryError(true)
            router.replace(PATH.EDITOR, { scroll: false })
        }
    }, [hasHandledQueryError, isError, router])

    const post = isCreationFlow ? undefined : data?.result
    const showLoader =
        !currentUser || isLoading || isFetching || !isVisible || (isError && !hasHandledQueryError)

    if (showLoader) {
        return (
            <div className='flex flex-1 items-center justify-center'>
                <LoadingDots />
            </div>
        )
    }

    return (
        <>
            <PostEditorHeader />

            {(!post || post.status === 'DRAFT') && (
                <DraftPostEditor
                    key={isCreationFlow ? draftSessionKey : `draft-post-${editorIdFromParams}`}
                    post={post}
                    editorId={editorIdFromParams}
                />
            )}

            {post?.status === 'PUBLISHED' && (
                <PublishedPostEditor
                    key={`published-${editorIdFromParams}`}
                    post={post}
                    editorId={editorIdFromParams}
                />
            )}
        </>
    )
}
