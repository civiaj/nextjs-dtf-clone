import crypto from 'crypto'
import fs from 'fs/promises'

export const createMediaHashFromBuffer = (buffer: Buffer): string => {
    return crypto.createHash('sha256').update(buffer).digest('hex')
}

export const createMediaHashFromPath = async (filePath: string): Promise<string> => {
    const fileBuffer = await fs.readFile(filePath)
    return createMediaHashFromBuffer(fileBuffer)
}
