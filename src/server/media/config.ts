import path from 'path'
import {
    MAX_AVATAR_DURATION,
    MAX_FILE_SIZE,
    MAX_VIDEO_DURATION,
    MIN_FILE_HEIGHT_PX,
    MIN_FILE_WIDTH_PX
} from '@/shared/constants'

export const MEDIA_OUTPUT_ROOT = path.resolve(process.cwd(), 'public', 'bucket')
export const MEDIA_TEMP_ROOT = path.resolve(process.cwd(), 'temp')

export const MEDIA_LIMITS = {
    maxUploadBytes: MAX_FILE_SIZE,
    minWidthPx: MIN_FILE_WIDTH_PX,
    minHeightPx: MIN_FILE_HEIGHT_PX,
    maxVideoDurationSec: MAX_VIDEO_DURATION,
    maxAvatarDurationSec: MAX_AVATAR_DURATION,
    maxInputPixels: 40_000_000,
    maxInputDimensionPx: 10_000,
    maxOutputDimensionPx: 4_096,
    ffmpegTimeoutMs: 60_000,
    ffprobeTimeoutMs: 15_000
} as const

export const IMAGE_EXTENSIONS = [
    'jpeg',
    'png',
    'webp',
    'heic',
    'heif',
    'tiff',
    'bmp',
    'avif'
] as const

export const VIDEO_EXTENSIONS = ['gif', 'mp4', 'mkv', 'mov', 'avi', 'webm'] as const
export const OUTPUT_EXTENSIONS = ['webp', 'jpeg', 'mp4'] as const

export type TOutputExtension = (typeof OUTPUT_EXTENSIONS)[number]

export const IMAGE_EXTENSION_SET = new Set<string>(IMAGE_EXTENSIONS)
export const VIDEO_EXTENSION_SET = new Set<string>(VIDEO_EXTENSIONS)
export const OUTPUT_EXTENSION_SET = new Set<string>(OUTPUT_EXTENSIONS)
