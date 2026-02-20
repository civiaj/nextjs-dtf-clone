import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { ApiError } from '@/lib/error'
import ffmpeg from '@/server/ffmpeg'
import { createMediaFilePath, ensureDirectoryExists } from '@/server/utils'
import { ERROR_MESSAGES } from '@/shared/constants'
import { Media } from '@/shared/services/prisma'
import { TMediaFormatImage, TMediaFormatVideo } from '@/shared/types/media.types'
import { IMediaFileRepository } from '../types'
import { createBlurDataURL } from '../utils/createBlurDataURL'
import { createMediaHashFromPath } from '../utils/createMediaHash'

export class MediaFileRepository implements IMediaFileRepository {
    async saveAnimatedWebp(
        buffer: Buffer
    ): Promise<Omit<Media, 'id' | 'original_hash' | 'context'>> {
        const format = 'webp'
        const output = createMediaFilePath('images', format)
        const temp = {
            filePath: path.join(path.join(process.cwd(), 'temp'), `${crypto.randomUUID()}.tmp`)
        }
        ensureDirectoryExists(path.dirname(output.filePath))
        ensureDirectoryExists(path.dirname(temp.filePath))

        try {
            fs.writeFileSync(temp.filePath, buffer)

            await new Promise((resolve, reject) => {
                ffmpeg(temp.filePath)
                    .outputOptions(['-t', '2', '-loop', '0', '-q:v', '70', '-preset', 'default'])
                    .outputFormat(format)
                    .save(output.filePath)
                    .on('end', resolve)
                    .on('error', reject)
            })

            const image = sharp(output.filePath)
            const { width = 0, height = 0 } = await image.metadata()

            const { size } = fs.statSync(output.filePath)

            const blurDataURL = await createBlurDataURL(output.filePath)
            const processed_hash = createMediaHashFromPath(output.filePath)

            return {
                src: '/bucket/images/'.concat(output.fileName, '.', format),
                type: 'image',
                format,
                blurDataURL,
                width,
                height,
                size,
                thumbnail: null,
                duration: null,
                processed_hash
            }
        } catch {
            fs.unlinkSync(temp.filePath)
            throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.PROCESSING_ERROR)
        } finally {
            fs.unlinkSync(temp.filePath)
        }
    }

    async saveImage(
        buffer: Buffer,
        format: TMediaFormatImage = 'webp'
    ): Promise<Omit<Media, 'id' | 'original_hash' | 'context'>> {
        const output = createMediaFilePath('images', format)
        ensureDirectoryExists(path.dirname(output.filePath))

        try {
            await sharp(buffer).rotate().toFormat(format).toFile(output.filePath)
            const { height = 0, width = 0 } = await sharp(output.filePath).metadata()
            const { size } = fs.statSync(output.filePath)

            const blurDataURL = await createBlurDataURL(output.filePath)
            const processed_hash = createMediaHashFromPath(output.filePath)

            return {
                src: '/bucket/images/'.concat(output.fileName, '.', format),
                type: 'image',
                format,
                blurDataURL,
                width,
                height,
                size,
                thumbnail: null,
                duration: null,
                processed_hash
            }
        } catch {
            if (format === 'webp') {
                return await this.saveImage(buffer, 'jpeg')
            } else {
                throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.PROCESSING_ERROR)
            }
        }
    }

    async saveVideo(
        buffer: Buffer,
        format: TMediaFormatVideo = 'mp4'
    ): Promise<Omit<Media, 'id' | 'original_hash' | 'context'>> {
        const temp = {
            filePath: path.join(path.join(process.cwd(), 'temp'), `${crypto.randomUUID()}.tmp`)
        }
        try {
            const output = createMediaFilePath('videos', 'mp4')

            ensureDirectoryExists(path.dirname(output.filePath))
            ensureDirectoryExists(path.dirname(temp.filePath))

            fs.writeFileSync(temp.filePath, buffer)

            if (format === 'mp4') {
                await new Promise((resolve, reject) => {
                    ffmpeg(temp.filePath)
                        .outputOptions([
                            '-movflags faststart',
                            '-c:v libx264',
                            '-preset fast',
                            `-crf 28`,
                            '-pix_fmt yuv420p',
                            '-c:a aac',
                            '-b:a 128k'
                        ])
                        .videoCodec('libx264')
                        .format('mp4')
                        .save(output.filePath)
                        .on('end', resolve)
                        .on('error', reject)
                })
            } else if (format === 'gif') {
                await new Promise((resolve, reject) => {
                    ffmpeg(temp.filePath)
                        .outputOptions([
                            '-movflags faststart',
                            '-c:v libx264',
                            '-preset fast',
                            `-crf 28`,
                            '-pix_fmt yuv420p',
                            '-vf',
                            'scale=trunc(iw/2)*2:trunc(ih/2)*2'
                        ])
                        .save(output.filePath)
                        .on('end', resolve)
                        .on('error', reject)
                })
            }

            const thumbnail = createMediaFilePath('videos', 'webp')
            await new Promise((resolve, reject) => {
                ffmpeg(output.filePath)
                    .screenshots({
                        count: 1,
                        folder: path.dirname(thumbnail.filePath),
                        filename: `${thumbnail.fileName}.webp`
                    })
                    .on('end', resolve)
                    .on('error', reject)
            })

            const metadata = await new Promise<ffmpeg.FfprobeData>((res, rej) => {
                ffmpeg.ffprobe(output.filePath, (err, data) => {
                    if (err) rej(err)
                    else res(data)
                })
            })

            const blurDataURL = await createBlurDataURL(thumbnail.filePath)
            const processed_hash = createMediaHashFromPath(output.filePath)

            return {
                src: '/bucket/videos/'.concat(output.fileName, '.mp4'),
                type: 'video',
                format,
                duration: metadata.format.duration || 0,
                width: metadata.streams[0].width || 0,
                height: metadata.streams[0].height || 0,
                size: metadata.format.size || 0,
                blurDataURL,
                thumbnail: '/bucket/videos/'.concat(thumbnail.fileName, '.webp'),
                processed_hash
            }
        } catch {
            fs.unlinkSync(temp.filePath)
            throw ApiError.BadRequest(ERROR_MESSAGES.MEDIA.PROCESSING_ERROR)
        } finally {
            fs.unlinkSync(temp.filePath)
        }
    }
}
