import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export const createMediaFilePath = (folder: string, format: string) => {
    const dir = path.join(process.cwd(), 'public', 'bucket', folder)
    ensureDirectoryExists(dir)
    const fileName = crypto.randomUUID()
    const filePath = path.join(dir, `${fileName}.${format}`)
    return { filePath, fileName }
}

export const ensureDirectoryExists = (dir: string) => {
    if (!fs.existsSync(dir || '')) {
        fs.mkdirSync(dir || '', { recursive: true })
    }
}
