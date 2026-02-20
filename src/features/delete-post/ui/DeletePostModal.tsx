import { useDeletePostMutation } from '@/entities/post'
import { formatErrorMessage } from '@/lib/error'
import { TPost } from '@/shared/types/post.types'
import { ContainerPadding } from '@/shared/ui/box'
import { Button } from '@/shared/ui/button'
import { ErrorMessage } from '@/shared/ui/error-message'
import { ModalWrapperRegular } from '@/shared/ui/modal'
import { Text } from '@/shared/ui/text'
import { showToast } from '@/shared/ui/toaster'

export const DeletePostModal = ({
    isOpen,
    onCloseModal,
    postId,
    title = 'Этот пост будет удален навсегда. Вы уверены, что хотите продолжить?'
}: {
    isOpen: boolean
    postId: TPost['id']
    onCloseModal: () => void
    title?: string
}) => {
    const [deletePost, { isError, error, isLoading }] = useDeletePostMutation()

    const onDeletePost = (e: React.FormEvent) => {
        e.preventDefault()
        deletePost(postId)
            .unwrap()
            .then(() => {
                onCloseModal()
            })
            .catch((err) => {
                showToast('warning', { description: formatErrorMessage(err) })
            })
    }

    if (!isOpen) return null

    return (
        <ModalWrapperRegular onCloseModal={onCloseModal}>
            <form onSubmit={onDeletePost}>
                <ContainerPadding
                    withBottom
                    isHeader>
                    <Text as='h2'>Удалить</Text>
                </ContainerPadding>
                <ContainerPadding
                    className='flex flex-col gap-3'
                    withBottom>
                    <Text as='p'>{title}</Text>
                    {isError && (
                        <ErrorMessage
                            variant='text'
                            error={error}
                        />
                    )}
                    <div className='flex gap-4 place-self-end'>
                        <Button
                            onClick={onCloseModal}
                            variant={'outline'}>
                            Отменить
                        </Button>
                        <Button
                            type='submit'
                            isLoading={isLoading}>
                            Подтвердить
                        </Button>
                    </div>
                </ContainerPadding>
            </form>
        </ModalWrapperRegular>
    )
}
