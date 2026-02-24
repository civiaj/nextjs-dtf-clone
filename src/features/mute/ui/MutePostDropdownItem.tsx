import { useState } from 'react'
import { useIsOwner } from '@/entities/auth'
import { EyeCloseAppIcon } from '@/shared/icons'
import { TPost } from '@/shared/types/post.types'
import { TUser } from '@/shared/types/user.types'
import { ContainerPadding } from '@/shared/ui/box'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu'
import { ModalWrapperRegular } from '@/shared/ui/modal'
import { Text } from '@/shared/ui/text'
import { CreateMuteInput } from '@/shared/validation/mute.schema'
import { useMuteUpdate } from '../hooks/useMuteUpdate'

export const MutePostDropdownItem = ({
    id,
    userId,
    onCloseDropdown
}: {
    id: TPost['id']
    userId: TUser['id']
    onCloseDropdown: () => void
}) => {
    const { isOwner } = useIsOwner(userId)
    const [isModal, setIsModal] = useState(false)

    const handleModalClose = () => {
        setIsModal(false)
        onCloseDropdown()
    }

    if (isOwner) return null

    return (
        <>
            <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault()
                    setIsModal(true)
                }}
                className='flex items-center gap-3'>
                <EyeCloseAppIcon />
                Скрыть
            </DropdownMenuItem>
            {isModal && (
                <MutePublishedPostModal
                    onCloseModal={handleModalClose}
                    id={id}
                    userId={userId}
                />
            )}
        </>
    )
}

const MutePublishedPostModal = ({
    onCloseModal,
    id,
    userId
}: {
    id: TPost['id']
    userId: TUser['id']
    onCloseModal: () => void
}) => {
    const { execute, isLoading } = useMuteUpdate()
    const [target, setTarget] = useState<CreateMuteInput['target']>('POST')

    const handleMuteUpdate = (e: React.FormEvent) => {
        e.preventDefault()
        execute(
            { action: 'mute', target, targetId: target === 'POST' ? id : userId },
            { onSuccess: onCloseModal }
        )
    }

    return (
        <ModalWrapperRegular onCloseModal={onCloseModal}>
            <ContainerPadding
                withBottom
                isHeader>
                <Text as='h2'>Скрыть</Text>
            </ContainerPadding>
            <form onSubmit={handleMuteUpdate}>
                <ContainerPadding
                    className='flex flex-col gap-3'
                    withBottom>
                    <div className='flex items-center space-x-3'>
                        <Checkbox
                            id='mute-post-checkbox'
                            checked={target === 'POST'}
                            onClick={() => setTarget('POST')}
                        />
                        <label
                            htmlFor='mute-post-checkbox'
                            className='cursor-pointer'>
                            <Text
                                as='span'
                                className='font-medium'>
                                Пост из всех лент
                            </Text>
                        </label>
                    </div>
                    <div className='flex items-center space-x-3'>
                        <Checkbox
                            id='mute-user-checkbox'
                            checked={target === 'USER'}
                            onClick={() => setTarget('USER')}
                        />
                        <label
                            htmlFor='mute-user-checkbox'
                            className='cursor-pointer'>
                            <Text
                                as='span'
                                className='font-medium'>
                                Заблокировать автора
                            </Text>
                        </label>
                    </div>
                    <Button
                        isLoading={isLoading}
                        className='self-end'
                        type='submit'>
                        Готово
                    </Button>
                </ContainerPadding>
            </form>
        </ModalWrapperRegular>
    )
}
