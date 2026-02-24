import sharp from 'sharp'

export const createBlurDataURL = async (input: string | Buffer): Promise<string> => {
    const stats = await sharp(input).stats()
    const [r = 127, g = 127, b = 127] = stats.channels.map((channel) => channel.mean)
    const blurBuffer = await sharp(input)
        .resize(24)
        .flatten({ background: { r, g, b } })
        .blur(8)
        .webp({ quality: 45 })
        .toBuffer()

    return `data:image/webp;base64,${blurBuffer.toString('base64')}`
}
