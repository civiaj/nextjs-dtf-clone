import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useLazyGetOwnerQuery, useSignupMutation } from '@/entities/auth'
import { formatErrorMessage } from '@/lib/error'
import { showToast } from '@/shared/ui/toaster'
import { signUpSchema, SignUpSchemaInput } from '@/shared/validation/user.schema'

export const useSignup = (onSuccess?: () => void) => {
    const form = useForm<SignUpSchemaInput>({
        resolver: zodResolver(signUpSchema),
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    })

    const [signup, { isLoading, isError, error }] = useSignupMutation()
    const [getOwner, { isError: isOwnerError, isLoading: isOwnerLoading, error: ownerError }] =
        useLazyGetOwnerQuery()

    const handleSubmit = async (values: SignUpSchemaInput) => {
        try {
            await signup(values).unwrap()
            await getOwner().unwrap()
            onSuccess?.()
        } catch (error) {
            showToast('warning', { description: formatErrorMessage(error) })
        }
    }

    return {
        signup: form.handleSubmit(handleSubmit),
        form,
        isLoading: isLoading || isOwnerLoading,
        isError: isError || isOwnerError,
        error: error || ownerError
    }
}
