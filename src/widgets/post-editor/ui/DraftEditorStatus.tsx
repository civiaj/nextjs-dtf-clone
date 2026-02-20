import React from 'react'
import { CheckAppIcon } from '@/shared/icons'
import { Text } from '@/shared/ui/text'

type DraftEditorStatusProps = {
    isSaving: boolean
    isPublishing: boolean
    isEmpty: boolean
    hasChanges: boolean
    isNavigatingAway: boolean
}

export const DraftEditorStatus = ({
    isSaving,
    isPublishing,
    isEmpty,
    hasChanges,
    isNavigatingAway
}: DraftEditorStatusProps) => {
    let status: FooterStatus = 'saved'

    if (isSaving) status = 'saving'
    else if (isPublishing || isNavigatingAway) status = 'publishing'
    else if (isEmpty || !hasChanges) status = 'idle'

    return FOOTER_STATUS_COMPONENTS[status]
}

type FooterStatus = 'idle' | 'saving' | 'saved' | 'publishing'

const FOOTER_STATUS_COMPONENTS: Record<FooterStatus, React.ReactNode> = {
    idle: null,
    saving: (
        <Text
            as='p'
            className='saving-text text-muted-foreground'>
            Сохранение
        </Text>
    ),
    saved: (
        <Text
            as='p'
            className='flex items-center gap-2 text-muted-foreground'>
            Сохранено
            <CheckAppIcon size={16} />
        </Text>
    ),
    publishing: (
        <Text
            as='p'
            className='saving-text text-muted-foreground'>
            Публикация
        </Text>
    )
}
