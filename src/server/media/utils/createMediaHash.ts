import crypto from 'crypto'
import fs from 'fs'

export const createMediaHashFromBuffer = (buffer: Buffer) => {
    return crypto.createHash('sha256').update(buffer).digest('hex')
}

export const createMediaHashFromPath = (filePath: string) => {
    try {
        const buffer = fs.readFileSync(filePath)
        return createMediaHashFromBuffer(buffer)
    } catch (error) {
        console.log(error, filePath)
        throw error
    }
}
