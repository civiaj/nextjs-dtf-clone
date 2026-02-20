import { API, BlockAPI } from '@editorjs/editorjs'
import ReactDOM, { Root } from 'react-dom/client'
import { EyeCloseAppIcon, StarAppIcon } from '@/shared/icons'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/common.utils'
import BlockState from './state'

interface BlockFlagsCSS {
    block: string
}

export default class BlockFlags {
    container: HTMLDivElement
    root: Root
    api: API
    block: BlockAPI
    state: BlockState

    private CSS: BlockFlagsCSS

    constructor({ api, block, state }: { api: API; block: BlockAPI; state: BlockState }) {
        this.block = block
        this.api = api
        this.CSS = { block: 'ce-flags' }
        this.container = this.getContainer()
        this.root = ReactDOM.createRoot(this.container)
        this.state = state

        this.render = this.render.bind(this)
        this.state.addEventListener('state-update', this.render)
    }

    destroy() {
        this.state.removeEventListener('state-update', this.render)
        this.root.unmount()
    }

    getContainer() {
        const div = document.createElement('div')
        div.classList.add(this.CSS.block)
        return div
    }

    render() {
        const { isHidden, isCover } = this.state

        this.root.render(
            <Flags
                isCover={isCover}
                isHidden={isHidden}
                toggleCover={() => this.state.setCover(!isCover)}
                toggleHidden={() => this.state.setHidden(!isHidden)}
            />
        )
    }
}

type FlagsProps = {
    isHidden: boolean
    isCover: boolean
    toggleCover: () => void
    toggleHidden: () => void
}

const Flags = ({ isCover, isHidden, toggleCover, toggleHidden }: FlagsProps) => {
    return (
        <>
            <Button
                onClick={toggleCover}
                size={'icon-sm'}
                variant={'ghost'}
                className={cn('col-start-1 col-end-2', {
                    ['pointer-events-none opacity-0']: !isCover
                })}>
                <StarAppIcon className='h-5 w-5' />
            </Button>

            <Button
                onClick={toggleHidden}
                size={'icon-sm'}
                variant={'ghost'}
                className={cn('col-start-2 col-end-3', {
                    ['pointer-events-none opacity-0']: !isHidden
                })}>
                <EyeCloseAppIcon className='h-5 w-5' />
            </Button>
        </>
    )
}
