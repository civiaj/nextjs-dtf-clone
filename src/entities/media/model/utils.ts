import { TMedia } from '@/shared/types/media.types'

export const updateSrcIfVideo = (media: Partial<TMedia>): Partial<TMedia> => {
    if ('type' in media && typeof media.type === 'string') {
        return { ...media, src: media.thumbnail ?? media.src }
    }

    return media
}
