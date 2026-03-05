import { TReactionBarProps } from '../../types'

type TReactionBarSize = TReactionBarProps['size']
type TReactionBarIconButtonSize = `icon-${TReactionBarSize}`

type TReactionBarSizeConfig = {
    svgClassName: string
    emojiClassName: string
    iconButtonSize: TReactionBarIconButtonSize
    dropdownItemClassName: string
}

export const reactionBarSizeConfig: Record<TReactionBarSize, TReactionBarSizeConfig> = {
    sm: {
        svgClassName: '[&_svg]:h-4 [&_svg]:w-4',
        emojiClassName: 'h-4 w-4',
        iconButtonSize: 'icon-sm',
        dropdownItemClassName: 'h-8 w-8'
    },
    md: {
        svgClassName: '[&_svg]:h-5 [&_svg]:w-5',
        emojiClassName: 'h-5 w-5',
        iconButtonSize: 'icon-md',
        dropdownItemClassName: 'h-8 w-8'
    }
}
