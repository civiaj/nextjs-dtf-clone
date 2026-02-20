import { RichContent } from '@/components/RichContent'
import { TBlockDataMap } from '../../types'

export const LinkBlock = ({ data }: TBlockDataMap['link']) => {
    const { description, hostname, image, title, url } = data

    return (
        <RichContent
            description={description}
            hostname={hostname}
            image={image}
            title={title}
            url={url}
            className=''
        />
    )
}
