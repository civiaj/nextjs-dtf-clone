import { TMediaResponse } from '@/shared/types/media.types'

export type TUploadMediaPromise = Promise<TMediaResponse> & { abort: () => void }
export type TUploadMediaOptions = { onProgress?: (progress: number) => void }
