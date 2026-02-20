import SyntaxHighlighter from 'react-syntax-highlighter'
import { CopyTextButton } from '@/components/CopyTextButton'
import { cn } from '@/shared/utils/common.utils'
import { TBlockDataMap } from '../../types'

export const CodeBlock = ({ data }: TBlockDataMap['code']) => {
    return (
        <div
            className={cn(
                'highlighter relative min-h-[100px] w-full rounded-xl border border-border p-2 text-xs sm:text-sm'
            )}>
            <SyntaxHighlighter language='jsx'>{data.code}</SyntaxHighlighter>
            <CopyTextButton
                text={data.code}
                className='absolute right-2 top-2'
            />
        </div>
    )
}
