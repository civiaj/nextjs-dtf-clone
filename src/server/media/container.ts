import { LocalMediaStorage } from './local-media.storage'
import { ImageProcessor } from './processors/image.processor'
import { VideoProcessor } from './processors/video.processor'
import { MediaRepository } from './repository'
import { MediaService } from './service'

const mediaStorage = new LocalMediaStorage()
const mediaRepository = new MediaRepository()
const imageProcessor = new ImageProcessor(mediaStorage)
const videoProcessor = new VideoProcessor(mediaStorage)

export const mediaService = new MediaService(mediaRepository, imageProcessor, videoProcessor)
