import Link from 'next/link'
import { TPostViewProps } from '../../types'

export const PostViewLinkWrapper = ({
    view,
    href,
    children
}: Pick<TPostViewProps, 'href' | 'view'> & { children: React.ReactNode }) => {
    if (view === 'cover' && href) {
        return (
            <div className='relative'>
                {children}
                <Link
                    href={href}
                    className='absolute inset-0'
                />
            </div>
        )
    }

    return children
}
