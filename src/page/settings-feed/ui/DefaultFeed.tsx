'use client'

import { uiActions } from '@/entities/ui'
import { useAppDispatch, useAppSelector } from '@/lib/store'
import { TMainPageSection } from '@/shared/types/comment.types'
import { DropDownFilter, TDropDownOption } from '@/shared/ui/dropdown-menu'

export const DefaultFeedSetter = () => {
    const dispatch = useAppDispatch()
    const defaultFeed = useAppSelector((state) => state.ui.defaultFeed)

    return (
        <DropDownFilter
            isResponsive={false}
            align='start'
            buttonClassname='w-full justify-between'
            buttonContainerClassname='justify-between w-full'
            options={FEED_OPTIONS}
            filter={defaultFeed}
            onClick={(v) => dispatch(uiActions.setDefaultFeed(v.value))}
        />
    )
}

const FEED_OPTIONS: TDropDownOption<TMainPageSection>[] = [
    { label: 'Популярное', value: 'popular' },
    { label: 'Свежее', value: 'new' },
    { label: 'Моя лента', value: 'my' }
]
