import { useAppSelector } from '@/lib/store'
import { PlusAppIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu'
import { LoadingDots } from '@/shared/ui/loading-indicator'
import { cn } from '@/shared/utils/common.utils'
import { ReactionBarButtonIcon } from './ReactionBarButtonIcon'
import { useReactionBarContext } from '../../model/reaction-bar-context/useReactionBarContext'

export const ReactionBarDropdown = () => {
    const { isLoading, size } = useReactionBarContext()
    return (
        <li>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        className={cn(
                            { ['[&_svg]:h-4 [&_svg]:w-4']: size === 'sm' },
                            { ['[&_svg]:h-5 [&_svg]:w-5']: size === 'md' }
                        )}
                        disabled={isLoading}
                        variant={'secondary'}
                        rounedness={'full'}
                        size={`icon-${size}`}>
                        <PlusAppIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align='start'
                    className='grid min-h-8 grid-cols-6 rounded-3xl'>
                    <ReactionBarDropdownContent />
                </DropdownMenuContent>
            </DropdownMenu>
        </li>
    )
}

const ReactionBarDropdownContent = () => {
    const reactions = useAppSelector((state) => state.assets.reactions)
    const { handleReactionMutation, isLoading } = useReactionBarContext()

    if (!reactions)
        return (
            <div className='col-span-full row-span-full flex items-center justify-center'>
                <LoadingDots />
            </div>
        )

    return reactions.map(({ emoji, id, name }) => (
        <DropdownMenuItem
            className='h-8 w-8 items-center justify-center rounded-full p-0 transition-transform'
            key={id}
            disabled={isLoading}
            aria-label={`reaction ${name}`}
            onClick={() => handleReactionMutation(id)}>
            <ReactionBarButtonIcon
                size='md'
                emoji={emoji}
                name={name}
            />
        </DropdownMenuItem>
    ))
}
