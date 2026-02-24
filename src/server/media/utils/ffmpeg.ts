import ffmpeg from '@/server/ffmpeg'

export const runFfmpegCommand = (
    command: ffmpeg.FfmpegCommand,
    starter: (command: ffmpeg.FfmpegCommand) => void,
    timeoutMs: number
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            command.kill('SIGKILL')
            reject(new Error('ffmpeg process timed out'))
        }, timeoutMs)

        command
            .on('end', () => {
                clearTimeout(timer)
                resolve()
            })
            .on('error', (error) => {
                clearTimeout(timer)
                reject(error)
            })

        starter(command)
    })
}

export const probeMediaWithFfmpeg = (
    filePath: string,
    timeoutMs: number
): Promise<ffmpeg.FfprobeData> => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('ffprobe process timed out'))
        }, timeoutMs)

        ffmpeg.ffprobe(filePath, (error, metadata) => {
            clearTimeout(timer)
            if (error) {
                reject(error)
                return
            }
            resolve(metadata)
        })
    })
}
