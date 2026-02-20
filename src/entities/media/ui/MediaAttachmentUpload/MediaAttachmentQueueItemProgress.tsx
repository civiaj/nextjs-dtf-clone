import { SpinnerProgress } from '@/shared/ui/loading-indicator'

export const MediaAttachmentQueueItemProgress = ({ progress }: { progress: number }) => {
    return (
        <div className='absolute inset-0 flex items-center justify-center rounded-xl bg-black/20 backdrop-blur-sm'>
            <SpinnerProgress progress={progress} />
        </div>
    )
}
