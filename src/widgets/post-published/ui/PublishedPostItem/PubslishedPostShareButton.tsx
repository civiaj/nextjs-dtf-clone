import Link from 'next/link'
import { MetricsButton } from '@/components/MetricsButton'
import { CopyUrlDropdownItem } from '@/features/copy-url-dropdown-item'
import { PATH } from '@/shared/constants'
import { RepostAppIcon, TelegramAppIcon } from '@/shared/icons'
import { TPost } from '@/shared/types/post.types'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu'

export const PublishedPostShareDropdown = ({ slug }: Pick<TPost, 'slug'>) => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/${PATH.POST}/${slug}`
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=`

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <MetricsButton
                    Icon={RepostAppIcon}
                    isActive={false}
                    count={0}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
                <CopyUrlDropdownItem url={url} />
                <DropdownMenuItem>
                    <Link
                        className='flex items-center gap-3'
                        href={shareUrl}
                        target='_blank'>
                        <TelegramAppIcon size={20} />
                        Поделиться в Telegram
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
