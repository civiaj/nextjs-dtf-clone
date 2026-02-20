import { useUpdateOwnerMutation } from '@/entities/auth'
import { useMediaUpload } from '@/entities/media'
import { formatErrorMessage } from '@/lib/error'
import { TMedia } from '@/shared/types/media.types'
import { showToast } from '@/shared/ui/toaster'

export const useUpdateOwnerAvatar = () => {
    const [update, { isLoading }] = useUpdateOwnerMutation()
    const { upload, isLoading: isUploading } = useMediaUpload()

    const updateAvatar = (file: File, onSuccess?: (nextAvatar: TMedia) => void) => {
        upload({ file }).then((result) => {
            if (result) {
                const avatarId = result.id
                update({ avatarId })
                    .unwrap()
                    .then(() => onSuccess?.(result))
                    .catch((err) => showToast('warning', { description: formatErrorMessage(err) }))
            }
        })
    }

    const removeAvatar = (onSuccess?: () => void) => {
        update({ avatarId: null })
            .unwrap()
            .then(() => onSuccess?.())
            .catch((err) => showToast('warning', { description: formatErrorMessage(err) }))
    }

    return { updateAvatar, removeAvatar, isLoading: isLoading || isUploading }
}
