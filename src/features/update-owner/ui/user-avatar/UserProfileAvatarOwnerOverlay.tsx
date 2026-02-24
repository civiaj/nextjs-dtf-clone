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
import { useUpdateOwner } from '../../model/hooks/useUpdateOwner'

export const UserProfileAvatarOwnerOverlay = ({
    avatar: initialAvatar,
    avatarColor,
    name
}: Pick<TUser, 'avatar' | 'avatarColor' | 'name'>) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const avatarRef = useRef<HTMLAnchorElement | null>(null)
    const [overlay, setOverlay] = useState<TOverlay>(!initialAvatar ? 'empty' : 'editable')
    const [avatar, setAvatar] = useState(initialAvatar)

    const { isLoading, isMediaUploading, updateProfileAvatar, removeProfileAvatar } =
        useUpdateOwner()

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
        updateProfileAvatar(file, {
            onSuccess: (user) => {
                setOverlay('editable')
                setAvatar(user.avatar)
            }
        })
    }

    const handleAvatarRemove = () => {
        removeProfileAvatar({
            onSuccess: () => {
                setOverlay('empty')
                setAvatar(null)
            }
        })
    }

    console.log({ isMediaUploading })

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
                        disabled={isLoading || isMediaUploading}
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
                                disabled={isLoading || isMediaUploading}>
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

            {(isLoading || isMediaUploading) && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
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
