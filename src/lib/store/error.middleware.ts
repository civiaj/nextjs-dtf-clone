import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import { isRejectedWithValue } from '@reduxjs/toolkit'
import { formatErrorMessage } from '@/lib/error'
import { showToast } from '@/shared/ui/toaster'

export const errorMiddleware: Middleware = (_api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const endpointName = (action.meta?.arg as { endpointName?: string })?.endpointName
        const description = formatErrorMessage(action.payload)

        if (endpointName && ['editorSave', 'editorPublish'].includes(endpointName)) {
            showToast('warning', { description })
        }
    }

    return next(action)
}
