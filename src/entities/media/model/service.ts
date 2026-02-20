'use client'

import { withAuthRetry } from '@/shared/utils/withAuthRetry'
import { MediaUploadSchemaInput } from '@/shared/validation/media/mediaSchema'
import { TUploadMediaOptions, TUploadMediaPromise } from '../types'

export const uploadMediaFile = (
    payload: MediaUploadSchemaInput,
    options?: TUploadMediaOptions
): TUploadMediaPromise => {
    let xhr: XMLHttpRequest

    const request = async () => {
        xhr = new XMLHttpRequest()
        xhr.open('POST', '/api/upload')
        xhr.responseType = 'json'

        return new Promise((resolve, reject) => {
            xhr.upload.onprogress = (event) => {
                options?.onProgress?.(Math.round((event.loaded / event.total) * 100))
            }

            xhr.onload = () => {
                if (xhr.status === 200 || xhr.status === 201) {
                    resolve(xhr.response)
                } else {
                    reject(xhr.response)
                }
            }

            const formData = new FormData()
            formData.append(`media`, payload.file)
            formData.append('options', JSON.stringify(payload?.options))

            xhr.send(formData)
        })
    }

    const promise = withAuthRetry(request) as TUploadMediaPromise

    promise.abort = () => xhr.abort()

    return promise
}
