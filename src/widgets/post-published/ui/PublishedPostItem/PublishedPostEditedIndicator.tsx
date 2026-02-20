import { EditAppIcon } from '@/shared/icons'
import { TPost } from '@/shared/types/post.types'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shared/ui/hover-card'
import { getAtDate } from '@/shared/utils/date.utils'

export const PublishedPostEditedIndicator = ({
    publishedAt,
    updatedAt
}: {
    publishedAt: NonNullable<TPost['publishedAt']>
    updatedAt: TPost['updatedAt']
}) => {
    const diffMs = Math.abs(new Date(updatedAt).getTime() - new Date(publishedAt!).getTime())
    const isEdited = diffMs > 1000

    if (!isEdited) return null

    return (
        <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
                <button
                    type='button'
                    className='ml-1 flex items-center justify-center'>
                    <EditAppIcon size={12} />
                </button>
            </HoverCardTrigger>
            <HoverCardContent align='start'>
                <div className='leading-tight'>
                    <div className='text-sm font-semibold'>История</div>
                    <div className='text-xs text-muted-foreground'>
                        Пост редактировался после публикации
                    </div>
                </div>
                <div className='my-3 h-px bg-border/60' />
                <dl className='grid grid-cols-[90px_1fr] gap-x-3 gap-y-2 text-sm'>
                    <dt className='text-xs text-muted-foreground'>Опубликован</dt>
                    <dd className='text-xs'>{getAtDate(publishedAt, ' в ')}</dd>
                    <dt className='text-xs text-muted-foreground'>Обновлён</dt>
                    <dd className='text-xs'>{getAtDate(updatedAt, ' в ')}</dd>
                </dl>
            </HoverCardContent>
        </HoverCard>
    )
}
