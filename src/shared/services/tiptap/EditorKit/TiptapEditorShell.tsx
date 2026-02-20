import { cn } from '@/shared/utils/common.utils'
import { TiptapEditorShellProps } from './types'

export const TiptapEditorShell = ({
    editor,
    attachments,
    leftControls,
    rightControls,
    className
}: TiptapEditorShellProps) => {
    return (
        <div
            className={cn(
                'active-glow group flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-secondary transition-colors focus-within:bg-card hover:bg-card',
                className
            )}>
            {editor}
            <div className='p-3'>
                {attachments}
                <div className='mt-3 flex justify-between'>
                    <div className='flex items-center gap-1'>{leftControls}</div>
                    <div className='flex items-center gap-2'>{rightControls}</div>
                </div>
            </div>
        </div>
    )
}
