'use client'

import { useMemo } from 'react'
import { useAuthGuard } from '@/entities/auth'
import { makeSelectPost, makeSelectPostIsDeleted, useGetPostQuery } from '@/entities/post'
import { useAppSelector } from '@/lib/store'
import { TPost } from '@/shared/types/post.types'

export const usePostData = (
    id: TPost['id'],
    { serverData, skip }: { serverData?: TPost; skip?: boolean } = {}
) => {
    const { currentUser } = useAuthGuard()
    const selectPost = useMemo(makeSelectPost, [])
    const selectIsDeleted = useMemo(makeSelectPostIsDeleted, [])
    const post = useAppSelector((state) => selectPost(state, id))
    const isClientDeleted = useAppSelector((state) => selectIsDeleted(state, id))

    const { isError } = useGetPostQuery(id, {
        skip: !currentUser || Boolean(post) || skip || isClientDeleted
    })

    return {
        post: post ?? serverData,
        isClientData: Boolean(post),
        isNotFound: isClientDeleted || isError
    }
}
