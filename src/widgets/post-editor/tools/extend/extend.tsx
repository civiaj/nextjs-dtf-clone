import { MoveEvent } from '@editorjs/editorjs/types/tools'
import BlockActions from './actions'
import BlockFlags from './flags'
import { BlockHandler } from './handlers'
import BlockMeta from './meta'
import BlockState from './state'
import BlockTools from './tools'
import { BlockListeners, Constructor, EditorBlockTool, ExtendedBlock } from '../../model/types'

/* eslint-disable @typescript-eslint/no-explicit-any */

export const ExtendBlock = <T extends object, C extends Constructor<EditorBlockTool<T>>>(
    Tool: C,
    handlers: BlockHandler[] = []
) => {
    class EditorBlock extends Tool implements ExtendedBlock {
        holder: HTMLElement | null
        actions: BlockActions
        state: BlockState
        meta: BlockMeta
        flags: BlockFlags
        tools: BlockTools
        handlers: BlockHandler[]
        listeners: BlockListeners[] = []

        constructor(...args: any[]) {
            super(...args)

            this.holder = null

            this.meta = new BlockMeta({ getTool: () => this, getElement: () => this.element })
            this.state = new BlockState({ block: this.block, meta: this.meta, data: args[0]?.data })
            this.actions = new BlockActions({
                api: this.api,
                block: this.block,
                getTool: () => this
            })
            this.flags = new BlockFlags({ api: this.api, block: this.block, state: this.state })

            this.tools = new BlockTools({
                api: this.api,
                block: this.block,
                state: this.state,
                meta: this.meta,
                actions: this.actions
            })

            this.handlers = handlers
        }

        createElement(className: string[]) {
            const indicators = document.createElement('div')
            indicators.classList.add(...className)
            return indicators
        }

        rendered() {
            super.rendered?.()
            this.updateHeadingStyle()

            if (!this.readOnly) {
                this.holder = this.block.holder
                this.holder.appendChild(this.flags.container)
                this.holder.appendChild(this.tools.container)
                this.setupListeners()
                this.tools.render()
                this.flags.render()
            }
        }

        render() {
            return super.render()
        }

        destroy(): void {
            this.state.destroy()

            this.offAll(this.element)
            super.destroy?.()

            requestAnimationFrame(() => {
                this.flags.destroy()
                this.tools.destroy()
            })
        }

        save(element: HTMLElement) {
            const data = super.save?.(element) ?? {}

            return {
                ...data,
                isCover: this.state.isCover,
                isHidden: this.state.isHidden
            }
        }

        moved(event: MoveEvent): void {
            const { fromIndex: from, toIndex: to } = event.detail
            const fromBlock = this.api.blocks.getBlockByIndex(from)
            const toBlock = this.api.blocks.getBlockByIndex(to)

            if (!fromBlock || !toBlock) return
            if (from !== 0 && to !== 0) return

            this.applyHeadingRules(fromBlock, from)
            this.applyHeadingRules(toBlock, to)
        }

        private applyHeadingRules(block: any | undefined, index: number) {
            if (!block || block.name !== 'heading') return

            if (index === 0) {
                this.state.destroyById(block.id)
            }

            const style = index === 0 ? 'title' : 'heading'
            block.call('updateHeadingstyle', { style })
        }

        private updateHeadingStyle() {
            const currentIndex = this.api.blocks.getBlockIndex(this.block.id)

            if (currentIndex === undefined) return

            this.applyHeadingRules(this.block, currentIndex)
        }

        private on<K extends keyof HTMLElementEventMap>(
            el: HTMLElement,
            type: K,
            handler: (e?: Event | undefined) => void
        ) {
            this.api.listeners.on(el, type, handler)
            this.listeners.push({ type, handler })
        }

        private offAll(el: HTMLElement) {
            for (const { type, handler } of this.listeners) {
                this.api.listeners.off(el, type, handler)
            }
            this.listeners = []
        }

        private setupListeners() {
            this.offAll(this.element)

            this.on(this.element, 'keydown', (e) => {
                if (!e) return

                const event = e as KeyboardEvent

                for (const handler of this.handlers) {
                    handler.onKeyDown?.(event, this)
                    if (event.defaultPrevented) break
                }
            })

            this.on(this.element, 'paste', (e) => {
                if (!e) return

                const event = e as ClipboardEvent

                for (const handler of this.handlers) {
                    handler.onPaste?.(event, this)
                    if (event.defaultPrevented) break
                }
            })

            this.on(this.element, 'input', (e) => {
                if (!e) return

                const event = e as InputEvent

                this.tools.render()

                for (const handler of this.handlers) {
                    handler.onInput?.(event, this)
                }
            })

            for (const handler of this.handlers) {
                handler.onRender?.(this)
            }
        }
    }

    return EditorBlock
}
