import { TPostData, TPostSelect } from '@/shared/types/post.types'

export const transformPost = (data: TPostSelect | null): TPostData | null =>
    data
        ? {
              ...data,
              blocks: data.blocks.flatMap(({ data }) => data) as TPostData['blocks']
          }
        : null
