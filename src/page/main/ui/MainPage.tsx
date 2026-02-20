'use client'

import { PublishedPostList } from '@/widgets/post-published'
import { useMainPageRoute } from '../model/hooks/useMainPageRoute'

export const MainPage = () => {
    const { sortValue } = useMainPageRoute()

    return (
        <PublishedPostList
            sortBy={sortValue}
            type='feed'
        />
    )
}
