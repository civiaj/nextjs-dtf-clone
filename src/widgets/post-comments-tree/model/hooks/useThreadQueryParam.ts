import { useSearchParams } from 'next/navigation'
import { COMMENT_THREAD_QUERY_PARAM } from '@/entities/comment'
import { TThreadId } from '../../types'

export const useThreadQueryParam = (): TThreadId | undefined => {
    const searchParams = useSearchParams()
    const threadParam = searchParams.get(COMMENT_THREAD_QUERY_PARAM)
    const parsedThreadId = threadParam ? Number(threadParam) : undefined

    return typeof parsedThreadId === 'number' && Number.isInteger(parsedThreadId)
        ? parsedThreadId
        : undefined
}
