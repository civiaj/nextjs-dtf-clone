'use client'

import { ReactNode, useState } from 'react'
import { ContainerPadding } from '@/shared/ui/box'
import { ModalWrapperRegular } from '@/shared/ui/modal'
import { Text } from '@/shared/ui/text'
import { GetUsersInput } from '@/shared/validation/user.schema'
import { UsersList } from './UsersList'

export const UsersListModal = ({
    isOpen,
    onCloseModal,
    title,
    ...args
}: {
    isOpen: boolean
    onCloseModal: () => void
    title: string
} & GetUsersInput) => {
    if (!isOpen) return null

    return (
        <ModalWrapperRegular
            onCloseModal={onCloseModal}
            insideScrollContainer={false}
            className='max-w-96'>
            <ContainerPadding
                className='border-b border-border'
                withBottom
                isHeader>
                <Text as='h2'>{title}</Text>
            </ContainerPadding>
            <UsersList
                mode='container'
                {...args}
            />
        </ModalWrapperRegular>
    )
}

export const UsersListModalTrigger = ({
    title,
    trigger,
    ...args
}: {
    title: string
    trigger: (props: UsersListModalTriggerChildrenProps) => ReactNode
} & GetUsersInput) => {
    const [isModal, setIsModal] = useState(false)
    const open = () => setIsModal(true)
    const close = () => setIsModal(false)
    const toggle = () => setIsModal((prev) => !prev)

    return (
        <>
            {trigger({
                isOpen: isModal,
                open,
                close,
                toggle
            })}
            <UsersListModal
                isOpen={isModal}
                onCloseModal={close}
                title={title}
                {...args}
            />
        </>
    )
}

type UsersListModalTriggerChildrenProps = {
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
}
