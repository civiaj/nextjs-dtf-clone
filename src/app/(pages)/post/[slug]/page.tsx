import { Metadata } from 'next'
import { PostDetailPage } from '@/page/post'
import { httpClient } from '@/server/lib'
import { PATH } from '@/shared/constants'
import { TParamsSlug } from '@/shared/types'
import { TPost } from '@/shared/types/post.types'

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: TParamsSlug): Promise<Metadata> {
    const params = await props.params
    const post = await httpClient<TPost>(`/posts/${params.slug}`)

    if (!post) {
        return {
            title: 'Страница не найдена',
            description: 'К сожалению, такой пост не существует.',
            robots: { index: false }
        }
    }

    return {
        title: post.title ?? `Пост пользователя ${post.user.name}`,
        description: `Пост пользователя ${post.user.name}`,
        openGraph: {
            title: post.title ?? 'Пост',
            description: `Пост пользователя ${post.user.name}`,
            type: 'article',
            url: `${process.env.NEXT_PUBLIC_APP_URL}/${PATH.POST}/${post.slug}`,
            publishedTime: post.publishedAt?.toString(),
            modifiedTime: post.updatedAt?.toString()
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title ?? 'Пост',
            description: `Пост пользователя ${post.user.name}`
        }
    }
}

const Page = async (props: TParamsSlug) => {
    const params = await props.params
    const post = await httpClient<TPost>(`/posts/${params.slug}`)
    return <PostDetailPage serverPost={post} />
}

export default Page
