import { useUpdateOwnerMutation } from '@/entities/auth'
import { formatErrorMessage } from '@/lib/error'
import { TMedia } from '@/shared/types/media.types'
import { TUser } from '@/shared/types/user.types'
import { showToast } from '@/shared/ui/toaster'

export const useUpdateOwnerCover = (onSuccess?: () => void) => {
    const [update, { isLoading }] = useUpdateOwnerMutation()

    const updateCover = (coverId: TMedia['id'] | null, coverY: TUser['coverY']) => {
        const safeCoverY = coverY !== null ? +coverY.toFixed(1) : coverY
        update({ coverId, coverY: safeCoverY })
            .unwrap()
            .then(() => onSuccess?.())
            .catch((err) => showToast('warning', { description: formatErrorMessage(err) }))
    }

    return { updateCover, isLoading }
}
