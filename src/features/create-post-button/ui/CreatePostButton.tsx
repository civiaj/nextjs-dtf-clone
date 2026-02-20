'use client'

import { useRouter } from 'next/navigation'
import { NEW_DRAFT_ID } from '@/entities/post'
import { useAppSelector } from '@/lib/store'
import { PATH } from '@/shared/constants'
import { EditAppIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/button'

export const CreatePostButton = () => {
    const router = useRouter()
    const currentUser = useAppSelector((state) => state.auth.currentUser)

    const handleClick = () => {
        if (!currentUser) {
            router.push('?modal=auth')
            return
        }

        router.push(`${PATH.EDITOR}?id=${NEW_DRAFT_ID}&reset=${Date.now()}`)
    }

    return (
        <Button
            onClick={handleClick}
            rounedness={'full'}
            variant={'base'}>
            <EditAppIcon size={20} />
            Написать
        </Button>
    )
}
