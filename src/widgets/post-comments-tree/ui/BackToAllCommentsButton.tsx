import { useRouter, useSearchParams } from 'next/navigation'
import { COMMENT_THREAD_QUERY_PARAM } from '@/entities/comment'
import { ContainerPadding } from '@/shared/ui/box'
import { Button } from '@/shared/ui/button'
import { getNoun } from '@/shared/utils/string.utils'

export const BackToAllCommentsButton = ({ commentCount }: { commentCount: number }) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const navigateToAllComments = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(COMMENT_THREAD_QUERY_PARAM)
        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <ContainerPadding>
            <Button
                onClick={navigateToAllComments}
                size={'md'}
                padding={'tight'}
                variant={'clean-active'}>
                {`Все ${commentCount} ${getNoun(commentCount, 'комментарий', 'комментария', 'комментариев')}`}
            </Button>
        </ContainerPadding>
    )
}
