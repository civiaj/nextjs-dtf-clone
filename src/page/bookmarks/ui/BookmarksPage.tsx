'use client'

import { PublishedPostList } from '@/widgets/post-published'
import { UserCommentsList } from '@/widgets/user-comments-list'
import { useBookmarksPageRoute } from '../model/hooks/useBookmarksPageRoute'

export const BookmarksPage = () => {
    const { sectionValue, slugValue } = useBookmarksPageRoute()

    if (sectionValue === 'bookmarks') {
        if (slugValue === 'comments') {
            return <UserCommentsList type='bookmarks' />
        }

        if (slugValue === 'posts') {
            return <PublishedPostList type='owner-bookmarks' />
        }
    }

    if (sectionValue === 'reactions') {
        if (slugValue === 'comments') {
            return <UserCommentsList type='reactions' />
        }

        if (slugValue === 'posts') {
            return <PublishedPostList type='owner-reactions' />
        }
    }

    return null
}
