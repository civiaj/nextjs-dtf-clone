'use client'

import { uiActions } from '@/entities/ui'
import { useAppDispatch, useAppSelector } from '@/lib/store'
import { TMainPageSection } from '@/shared/types/comment.types'
import { DropDownFilter, DropDownOption } from '@/shared/ui/dropdown-menu'

export const DefaultFeedSetter = () => {
    const dispatch = useAppDispatch()
    const defaultFeed = useAppSelector((state) => state.ui.defaultFeed)

    const handleClick = ({ value }: DropDownOption<TMainPageSection>) => {
        dispatch(uiActions.setDefaultFeed(value))
    }

    return (
        <DropDownFilter
            responsive={false}
            align='start'
            options={FEED_OPTIONS}
            filter={defaultFeed}
            onClick={handleClick}
            triggerClassname='w-full'
        />
    )
}

const FEED_OPTIONS: DropDownOption<TMainPageSection>[] = [
    { label: 'Популярное', value: 'popular' },
    { label: 'Свежее', value: 'new' },
    { label: 'Моя лента', value: 'my' }
]
