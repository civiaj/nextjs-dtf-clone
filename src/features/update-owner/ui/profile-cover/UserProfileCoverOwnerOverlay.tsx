import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useMediaUpload } from '@/entities/media'
import {
    EditAppIcon,
    ImageAppIcon,
    MoveAppIcon,
    SettingsAppIcon,
    TrashAppIcon
} from '@/shared/icons'
import { TUser } from '@/shared/types/user.types'
import { ContainerPadding } from '@/shared/ui/box'
import { Button } from '@/shared/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu'
import { FileInput } from '@/shared/ui/FileInput'
import { LoadingDots } from '@/shared/ui/loading-indicator'
import { cn } from '@/shared/utils/common.utils'
import { UserProfileCoverImage } from './UserProfileCoverImage'
import { useCoverDrag } from '../../model/hooks/useCoverDrag'
import { useUpdateOwner } from '../../model/hooks/useUpdateOwner'

export const UserProfileCoverOwnerOverlay = ({
    cover: initialCover,
    coverY: initialCoverY
}: Pick<TUser, 'cover' | 'coverY' | 'id'> & {}) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const coverElementRef = useRef<HTMLDivElement>(null)

    const [cover, setCover] = useState<TUser['cover']>(initialCover)
    const [coverY, setCoverY] = useState<NonNullable<TUser['coverY']>>(initialCoverY ?? 0)
    const [overlay, setOverlay] = useState<TOverlay>(getInitialOverlayStatus(initialCover))
    const prevCoverY = useRef<NonNullable<TUser['coverY']>>(initialCoverY ?? 0)
    const prevCover = useRef<TUser['cover']>(initialCover)

    const [upload, { isLoading: isUploading }] = useMediaUpload()
    const { updateProfileCover, isLoading } = useUpdateOwner()

    const openFileInput = () => fileInputRef.current?.click()

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        e.currentTarget.value = ''
        upload({ file, options: { context: 'COVER' } }).then((result) => {
            if (result) {
                flushSync(() => {
                    setCover(result)
                    setCoverY(0)
                    prevCoverY.current = coverY
                    prevCover.current = cover
                })
                setOverlay('active')
            }
        })
    }

    const handleDragUpdate = (deltaY: number) => {
        const el = coverElementRef.current
        if (!el || !cover) return

        const containerWidth = el.clientWidth
        const containerHeight = el.clientHeight

        const imageAspect = cover.width / cover.height
        const containerAspect = containerWidth / containerHeight

        let renderedHeight: number
        if (imageAspect > containerAspect) {
            renderedHeight = containerHeight
        } else {
            renderedHeight = containerWidth / imageAspect
        }

        const maxOffset = Math.max(0, renderedHeight - containerHeight)
        const ratioPxToPercent = maxOffset ? 100 / maxOffset : 0
        const nextCoverY = Math.max(0, Math.min(100, coverY - deltaY * ratioPxToPercent))

        el.style.setProperty('--coverY', `${nextCoverY}%`)
    }

    const handleDragEnd = () => {
        const el = coverElementRef.current
        if (!el) return
        const styleValue = el.style.getPropertyValue('--coverY').replace('%', '')
        setCoverY(parseFloat(styleValue))
    }

    const handleUpdateCover = () => {
        updateProfileCover({ coverId: cover?.id, coverY })
        setOverlay('editable')
        prevCoverY.current = coverY
        prevCover.current = cover
    }

    const handleRemoveCover = () => {
        updateProfileCover({ coverId: null, coverY: null })
        setCover(null)
        setCoverY(0)
        setOverlay('empty')
    }

    const handleCancelActive = () => {
        setCover(prevCover.current)
        setCoverY(prevCoverY.current)
        setOverlay(getInitialOverlayStatus(prevCover.current))
    }

    return (
        <>
            <UserProfileCoverImage
                key={cover?.id ?? 0}
                cover={cover}
                coverY={coverY}
                ref={coverElementRef}
            />
            <FileInput
                ref={fileInputRef}
                onChange={handleFileInputChange}
            />
            {isUploading && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm'>
                    <LoadingDots className='bg-white' />
                </div>
            )}
            <ContainerPadding
                withBottom
                className='pointer-events-none absolute inset-0 flex'>
                {overlay === 'empty' && (
                    <Button
                        onClick={openFileInput}
                        className={cn('pointer-events-auto mx-auto self-center', {
                            ['pointer-events-none opacity-0']: isLoading || isUploading
                        })}
                        disabled={isLoading || isUploading}
                        variant={'base-light'}
                        size={'sm'}>
                        <ImageAppIcon size={16} />
                        Добавить обложку
                    </Button>
                )}
                {overlay === 'editable' && (
                    <EditableOverlay
                        isLoading={isLoading || isUploading}
                        onStartEdit={() => setOverlay('active')}
                        onDelete={handleRemoveCover}
                        openFileInput={openFileInput}
                    />
                )}
                {overlay === 'active' && (
                    <ActiveOverlay
                        isLoading={isLoading || isUploading}
                        coverElement={coverElementRef.current}
                        onDragUpdate={handleDragUpdate}
                        onDragEnd={handleDragEnd}
                        onUpdateCover={handleUpdateCover}
                        onCancel={handleCancelActive}
                    />
                )}
            </ContainerPadding>
        </>
    )
}

const ActiveOverlay = ({
    coverElement,
    isLoading,
    onCancel,
    onUpdateCover,
    onDragUpdate,
    onDragEnd
}: {
    coverElement: HTMLDivElement | null
    onCancel: () => void
    onUpdateCover: () => void
    onDragUpdate: (deltaY: number) => void
    onDragEnd: () => void
    isLoading: boolean
}) => {
    const { isDragging } = useCoverDrag(coverElement, { onDragUpdate, onDragEnd })
    return (
        <>
            <Button
                className={cn(
                    'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 transition-opacity',
                    { ['opacity-0']: isDragging }
                )}
                variant={'base-light'}
                size={'sm'}>
                <MoveAppIcon size={16} />
                Перетащите, чтобы изменить положение
            </Button>

            <div className='ml-auto flex gap-2 self-end'>
                <Button
                    onClick={onCancel}
                    disabled={isLoading}
                    className='pointer-events-auto'
                    variant={'base'}
                    size={'sm'}>
                    Отменить
                </Button>
                <Button
                    onClick={onUpdateCover}
                    disabled={isLoading}
                    className='pointer-events-auto'
                    variant={'active'}
                    size={'sm'}>
                    Сохранить
                </Button>
            </div>
        </>
    )
}

const EditableOverlay = ({
    isLoading,
    openFileInput,
    onDelete,
    onStartEdit
}: {
    onDelete: () => void
    onStartEdit: () => void
    openFileInput: () => void
    isLoading: boolean
}) => {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger
                asChild
                className='pointer-events-auto ml-auto self-end justify-self-end'>
                <Button
                    disabled={isLoading}
                    variant={'base-light'}
                    size={'sm'}>
                    <EditAppIcon />
                    Редактировать обложку
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='end'
                className='min-w-36'>
                <DropdownMenuItem onClick={openFileInput}>
                    <EditAppIcon />
                    Изменить
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onStartEdit}>
                    <SettingsAppIcon />
                    Настроить
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete}>
                    <TrashAppIcon />
                    Удалить
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

type TOverlay = 'empty' | 'editable' | 'active'

const getInitialOverlayStatus = (cover: TUser['cover']): TOverlay => {
    return cover ? 'editable' : 'empty'
}
