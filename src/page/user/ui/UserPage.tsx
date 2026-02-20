'use client'

import { PublishedPostList } from '@/widgets/post-published'
import { UserCommentsList } from '@/widgets/user-comments-list'
import { useUserPageRoute } from '../model/hooks/useUserPageRoute'

export const UserPage = () => {
    const { sectionValue, sortValue, idValue } = useUserPageRoute()

    if (sectionValue === 'posts') {
        return (
            <PublishedPostList
                type='users'
                userId={idValue}
                sortBy={sortValue}
            />
        )
    }

    if (sectionValue === 'comments') {
        return (
            <UserCommentsList
                type='user'
                sortBy={sortValue}
                userId={idValue}
            />
        )
    }

    return null
}
