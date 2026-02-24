import { CopyAppIcon } from '@/shared/icons'
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu'
import { showToast } from '@/shared/ui/toaster'
import { copyTextToClipboard } from '@/shared/utils/copyTextToClipboard'

export const CopyUrlDropdownItem = ({ url }: { url: string }) => {
    const handleCopy = async () => {
        copyTextToClipboard(url).then(() =>
            showToast('success', { description: 'Ссылка скопирована.' })
        )
    }

    return (
        <DropdownMenuItem onClick={handleCopy}>
            <CopyAppIcon />
            Копировать ссылку
        </DropdownMenuItem>
    )
}
