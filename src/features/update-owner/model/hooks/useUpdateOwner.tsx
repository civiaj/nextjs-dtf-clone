import { useAuthGuard } from '@/entities/auth'
import { useMediaUpload } from '@/entities/media'
import { formatErrorMessage } from '@/lib/error'
import { TUser } from '@/shared/types/user.types'
import { showToast } from '@/shared/ui/toaster'
import { PatchUserSchemaInput } from '@/shared/validation/user.schema'
import { useUpdateOwnerMutation } from '../service'

type TOptions = {
    onSuccess?: (res: TUser) => void
    onError?: (err: unknown) => void
    onFinally?: () => void
}

export const useUpdateOwner = () => {
    const { promptLoginIfUnauthorized } = useAuthGuard()
    const [update, queryResult] = useUpdateOwnerMutation()
    const [upload, { isLoading: isMediaUploading, progressNum, abort: abortMediaUpload }] =
        useMediaUpload()

    const runIfAuthorized = (options: TOptions, callback: () => void) => {
        if (promptLoginIfUnauthorized()) {
            options.onFinally?.()
            return
        }

        callback()
    }

    const executeUpdateOwner = (input: PatchUserSchemaInput, options: TOptions) => {
        update(input)
            .unwrap()
            .then((res) => options.onSuccess?.(res.result))
            .catch((err) => {
                options.onError?.(err)
                showToast('warning', { description: formatErrorMessage(err) })
            })
            .finally(() => options.onFinally?.())
    }

    const updateOwner = (input: PatchUserSchemaInput, options: TOptions = {}) => {
        runIfAuthorized(options, () => executeUpdateOwner(input, options))
    }

    const updateProfileAvatar = (file: File, options: TOptions = {}) => {
        runIfAuthorized(options, () => {
            upload({ file, options: { context: 'AVATAR' } }).then((result) => {
                if (!result) {
                    options.onFinally?.()
                    return
                }

                executeUpdateOwner({ avatarId: result.id }, options)
            })
        })
    }

    const removeProfileAvatar = (options: TOptions = {}) => {
        updateOwner({ avatarId: null }, options)
    }

    const updateProfileCover = (
        input: Pick<PatchUserSchemaInput, 'coverId' | 'coverY'>,
        options: TOptions = {}
    ) => {
        const safeCoverY = input.coverY ? +input.coverY.toFixed(1) : input.coverY
        updateOwner({ ...input, coverY: safeCoverY }, options)
    }

    const updateBlog = (
        input: Pick<PatchUserSchemaInput, 'description' | 'name'>,
        options: TOptions = {}
    ) => {
        updateOwner(input, {
            ...options,
            onSuccess: (result) => {
                options.onSuccess?.(result)
                showToast('success', { description: 'Данные блога обновлены.' })
            }
        })
    }

    return {
        updateProfileAvatar,
        removeProfileAvatar,
        updateProfileCover,
        updateBlog,
        isMediaUploading,
        progressNum,
        abortMediaUpload,
        ...queryResult
    }
}
