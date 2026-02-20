import { formatErrorMessage } from '@/lib/error'
import { MessageContainer } from '@/shared/ui/box'
import { Text } from '@/shared/ui/text'

type Props = {
    variant?: 'container' | 'text'
    error: unknown
}

export const ErrorMessage = ({ error, variant = 'container' }: Props) => {
    const errorMessage = formatErrorMessage(error)

    if (variant === 'container') return <MessageContainer>{errorMessage}</MessageContainer>

    if (variant === 'text')
        return (
            <Text
                className='text-xs font-medium text-destructive md:text-sm'
                as='p'>
                {errorMessage}
            </Text>
        )

    return null
}
