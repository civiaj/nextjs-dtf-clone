'use client'

import { ErrorMessage } from '@/shared/ui/error-message'

const Page = ({ error, reset: _ }: { error: Error & { digest?: string }; reset: () => void }) => {
    return (
        <ErrorMessage
            variant='container'
            error={error}
        />
    )
}

export default Page
