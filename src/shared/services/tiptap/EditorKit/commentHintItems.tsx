import { TiptapHintItem } from './types'

export const commentHintItems: TiptapHintItem[] = [
    {
        symbol: '@',
        title: 'Mention',
        description: (
            <>
                <span>Start with </span>
                <code className='rounded-md bg-muted px-1 font-medium text-foreground'>@</code>
                <span> and type the first letters of a username.</span>
            </>
        )
    },
    {
        symbol: '>',
        title: 'Quote',
        description: (
            <>
                <span>Use </span>
                <code className='rounded-md bg-muted px-1 font-medium text-foreground'>{'>'}</code>
                <span> at line start. Press </span>
                <code className='rounded-md bg-muted px-1 font-medium text-foreground'>Enter</code>
                <span> twice to exit quote mode.</span>
            </>
        )
    }
]
