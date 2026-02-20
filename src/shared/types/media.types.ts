import { FileFormat } from '@prisma/client'
import { z } from 'zod'
import { Media, mediaSelect, Prisma } from '@/shared/services/prisma'
import { ResponseBase } from '@/shared/types/common.types'
import { imageSchema, videoSchema } from '@/shared/validation/media/media.validation'

export type TMediaSelect = Prisma.MediaGetPayload<{ select: typeof mediaSelect }>
export type TMediaFormatImage = Extract<FileFormat, 'webp' | 'jpeg'>
export type TMediaFormatVideo = Extract<FileFormat, 'mp4' | 'gif'>

export type TMediaImage = z.infer<typeof imageSchema>
export type TMediaVideo = z.infer<typeof videoSchema>

export type TMedia = TMediaSelect
export type TMediaWithCaption = { text: string; media: TMedia }
export type TMediaDbPayload = Omit<Media, 'id'>
export type TMediaResponse = ResponseBase<TMedia>
