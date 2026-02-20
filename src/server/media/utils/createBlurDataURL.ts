import sharp from 'sharp'

export const createBlurDataURL = async (imagePath: string): Promise<string> => {
    const metadata = await sharp(imagePath).stats()
    const avg = metadata.channels.map((ch) => ch.mean)
    const blurImageBuffer = await sharp(imagePath)
        .resize(20)
        .flatten({ background: { r: avg[0], g: avg[1], b: avg[2] } })
        .blur(10)
        .webp()
        .toBuffer()
    return `data:image/webp;base64,${blurImageBuffer.toString('base64')}`
}
