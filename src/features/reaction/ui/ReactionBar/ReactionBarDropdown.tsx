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
import { reactionBarSizeConfig } from './size'
import { TReactionBarProps, TReactionMutateFn } from '../../types'

type TReactionBarDropdownProps = {
    size: TReactionBarProps['size']
    isLoading: boolean
    onReactionClick: TReactionMutateFn
}

export const ReactionBarDropdown = ({
    size,
    isLoading,
    onReactionClick
}: TReactionBarDropdownProps) => {
    const sizeConfig = reactionBarSizeConfig[size]

    return (
        <li>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        className={cn(sizeConfig.svgClassName)}
                        disabled={isLoading}
                        variant={'secondary'}
                        rounedness={'full'}
                        size={sizeConfig.iconButtonSize}>
                        <PlusAppIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align='start'
                    className='grid min-h-8 grid-cols-6 rounded-3xl'>
                    <ReactionBarDropdownContent
                        size={size}
                        isLoading={isLoading}
                        onReactionClick={onReactionClick}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        </li>
    )
}

const ReactionBarDropdownContent = ({
    size,
    isLoading,
    onReactionClick
}: TReactionBarDropdownProps) => {
    const reactions = useAppSelector((state) => state.assets.reactions)
    const sizeConfig = reactionBarSizeConfig[size]

    if (reactions.length === 0)
        return (
            <div className='col-span-full row-span-full flex items-center justify-center'>
                <LoadingDots />
            </div>
        )

    return reactions.map(({ emoji, id, name }) => (
        <DropdownMenuItem
            className={cn(
                sizeConfig.dropdownItemClassName,
                'items-center justify-center rounded-full p-0 transition-transform'
            )}
            key={id}
            disabled={isLoading}
            aria-label={`reaction ${name}`}
            onClick={() => onReactionClick(id)}>
            <ReactionBarButtonIcon
                size={size}
                emoji={emoji}
                name={name}
            />
        </DropdownMenuItem>
    ))
}
