import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLazyGetOwnerQuery, useLoginMutation } from '@/entities/auth'
import { formatErrorMessage } from '@/lib/error'
import { showToast } from '@/shared/ui/toaster'
import { loginSchema, LoginSchemaInput } from '@/shared/validation/user.schema'

export const useLogin = (onSuccess?: () => void) => {
    const form = useForm<LoginSchemaInput>({
        resolver: zodResolver(loginSchema),
        mode: 'onSubmit',
        defaultValues: { email: '', password: '' }
    })

    const [login, { isLoading, isError, error }] = useLoginMutation()
    const [getOwner, { isError: isOwnerError, isLoading: isOwnerLoading, error: ownerError }] =
        useLazyGetOwnerQuery()

    const handleSubmit = async (values: LoginSchemaInput) => {
        try {
            await login(values).unwrap()
            await getOwner().unwrap()
            onSuccess?.()
        } catch (error) {
            showToast('warning', { description: formatErrorMessage(error) })
        }
    }

    return {
        login: form.handleSubmit(handleSubmit),
        form,
        isLoading: isLoading || isOwnerLoading,
        isError: isError || isOwnerError,
        error: error || ownerError
    }
}
