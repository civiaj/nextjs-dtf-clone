import { useRef, useState } from 'react'
import { EditAppIcon, EyeOpenAppIcon, MediaAppIcon, TrashAppIcon } from '@/shared/icons'
import { TUser } from '@/shared/types/user.types'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu'
import { FileInput } from '@/shared/ui/FileInput'
import { LoadingDots } from '@/shared/ui/loading-indicator'
import { UserProfileAvatarImage } from './UserProfileAvatarImage'
import { useUpdateOwnerAvatar } from '../model/hooks/useUpdateOwnerAvatar'

export const UserProfileAvatarOwnerOverlay = ({
    avatar: initialAvatar,
    avatarColor,
    name
}: Pick<TUser, 'avatar' | 'avatarColor' | 'name'>) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const avatarRef = useRef<HTMLAnchorElement | null>(null)
    const [overlay, setOverlay] = useState<TOverlay>(!initialAvatar ? 'empty' : 'editable')
    const [avatar, setAvatar] = useState(initialAvatar)

    const { isLoading, updateAvatar, removeAvatar } = useUpdateOwnerAvatar()

    const handleOpenFileInput = () => {
        fileInputRef.current?.click()
    }

    const handleOpenAvatarPreview = () => {
        avatarRef.current?.click()
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        e.currentTarget.value = ''
        updateAvatar(file, (nextAvatar) => {
            setOverlay('editable')
            setAvatar(nextAvatar)
        })
    }

    const handleAvatarRemove = () => {
        removeAvatar(() => {
            setOverlay('empty')
            setAvatar(null)
        })
    }

    return (
        <>
            <UserProfileAvatarImage
                key={avatar?.id ?? 0}
                ref={avatarRef}
                avatar={avatar}
                avatarColor={avatarColor}
                name={name}
            />

            <div className='absolute inset-0 overflow-hidden rounded-full bg-black/30 text-white opacity-0 transition-opacity focus-within:opacity-100 hover:opacity-100'>
                {overlay === 'empty' && (
                    <button
                        className='flex h-full w-full items-center justify-center'
                        aria-label='Добавить аватар'
                        disabled={isLoading}
                        onClick={handleOpenFileInput}>
                        <MediaAppIcon size={26} />
                    </button>
                )}
                {overlay === 'editable' && (
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <button
                                className='flex h-full w-full items-center justify-center'
                                aria-label='Настроить аватар'
                                disabled={isLoading}>
                                <MediaAppIcon size={26} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='start'>
                            <DropdownMenuItem onClick={handleOpenAvatarPreview}>
                                <EyeOpenAppIcon />
                                Посмотреть
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleOpenFileInput}>
                                <EditAppIcon />
                                Изменить
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleAvatarRemove}>
                                <TrashAppIcon />
                                Удалить
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {isLoading && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                    <LoadingDots className='bg-white' />
                </div>
            )}

            <FileInput
                ref={fileInputRef}
                onChange={handleFileInputChange}
            />
        </>
    )
}

type TOverlay = 'editable' | 'empty'
