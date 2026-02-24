import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import { ApiError } from '@/lib/error'
import { ERROR_MESSAGES } from '@/shared/constants'
import {
    MEDIA_OUTPUT_ROOT,
    MEDIA_TEMP_ROOT,
    OUTPUT_EXTENSION_SET,
    TOutputExtension
} from './config'

export type TMediaBucket = 'images' | 'videos'
export type TStorageFile = {
    absolutePath: string
    publicPath: string
}

const REMOVE_RETRYABLE_CODES = new Set(['EBUSY', 'EPERM', 'ENOTEMPTY'])
const REMOVE_MAX_ATTEMPTS = 6
const REMOVE_BASE_DELAY_MS = 40

const sleep = async (ms: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, ms))
}

const isNodeErrorWithCode = (error: unknown): error is NodeJS.ErrnoException => {
    return typeof error === 'object' && error !== null && 'code' in error
}

export class LocalMediaStorage {
    constructor(
        private outputRoot: string = MEDIA_OUTPUT_ROOT,
        private tempRoot: string = MEDIA_TEMP_ROOT
    ) {}

    async createOutputFile(
        bucket: TMediaBucket,
        extension: TOutputExtension
    ): Promise<TStorageFile> {
        this.assertSafeFilePart(bucket)
        this.assertSafeFilePart(extension)
        if (!OUTPUT_EXTENSION_SET.has(extension)) {
            throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.WRONG_FORMAT(extension))
        }

        const fileName = `${crypto.randomUUID()}.${extension}`
        const absolutePath = this.resolveWithinRoot(this.outputRoot, bucket, fileName)

        await fs.mkdir(path.dirname(absolutePath), { recursive: true })

        return {
            absolutePath,
            publicPath: `/bucket/${bucket}/${fileName}`
        }
    }

    async createTempFile(extension: string = 'tmp'): Promise<string> {
        this.assertSafeFilePart(extension)
        const fileName = `${crypto.randomUUID()}.${extension}`
        const absolutePath = this.resolveWithinRoot(this.tempRoot, fileName)
        await fs.mkdir(path.dirname(absolutePath), { recursive: true })
        return absolutePath
    }

    async writeFile(filePath: string, content: Buffer): Promise<void> {
        await fs.mkdir(path.dirname(filePath), { recursive: true })
        await fs.writeFile(filePath, content, { mode: 0o600 })
    }

    async getFileSize(filePath: string): Promise<number> {
        const stat = await fs.stat(filePath)
        return stat.size
    }

    async removeFile(filePath: string): Promise<void> {
        for (let attempt = 1; attempt <= REMOVE_MAX_ATTEMPTS; attempt += 1) {
            try {
                await fs.rm(filePath, { force: true })
                return
            } catch (error) {
                const retryable =
                    isNodeErrorWithCode(error) &&
                    typeof error.code === 'string' &&
                    REMOVE_RETRYABLE_CODES.has(error.code)

                if (!retryable || attempt === REMOVE_MAX_ATTEMPTS) {
                    throw error
                }

                await sleep(REMOVE_BASE_DELAY_MS * attempt)
            }
        }
    }

    async removeFiles(paths: string[]): Promise<void> {
        const errors: unknown[] = []

        for (const filePath of paths) {
            try {
                await this.removeFile(filePath)
            } catch (error) {
                errors.push(error)
            }
        }

        if (errors.length > 0) {
            throw errors[0]
        }
    }

    private resolveWithinRoot(root: string, ...parts: string[]): string {
        const resolvedRoot = path.resolve(root)
        const resolvedPath = path.resolve(resolvedRoot, ...parts)
        const rootPrefix = resolvedRoot.endsWith(path.sep)
            ? resolvedRoot
            : `${resolvedRoot}${path.sep}`

        if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(rootPrefix)) {
            throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.PROCESSING_ERROR)
        }

        return resolvedPath
    }

    private assertSafeFilePart(value: string): void {
        if (!/^[a-z0-9-]+$/i.test(value)) {
            throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.PROCESSING_ERROR)
        }
    }
}
