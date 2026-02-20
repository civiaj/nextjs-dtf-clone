import Link from 'next/link'
import { MetricsButton } from '@/components/MetricsButton'
import { PATH } from '@/shared/constants'
import { CommentAppIcon } from '@/shared/icons'
import { TPost } from '@/shared/types/post.types'

export const PublishedPostCommentsButton = ({
    commentCount,
    slug
}: Pick<TPost, 'slug' | 'commentCount'>) => {
    return (
        <Link href={`${PATH.POST}/${slug}#comments`}>
            <MetricsButton
                Icon={CommentAppIcon}
                isActive={false}
                count={commentCount}
            />
        </Link>
    )
}
