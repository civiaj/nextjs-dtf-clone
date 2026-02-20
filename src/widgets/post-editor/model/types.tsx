import { API, BlockAPI, BlockTool } from '@editorjs/editorjs'
import BlockActions from '../tools/extend/actions'
import BlockFlags from '../tools/extend/flags'
import { BlockHandler } from '../tools/extend/handlers'
import BlockMeta from '../tools/extend/meta'
import BlockState from '../tools/extend/state'
import BlockTools from '../tools/extend/tools'

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface EditorBlockArgs<T> {
    api: API
    block: BlockAPI
    readOnly: boolean
    data: object
    config?: T
}

export interface EditorBlockTool<T extends object = object> extends BlockTool {
    api: API
    block: BlockAPI
    element: HTMLElement
    data: T
    readOnly: boolean
}

export type BlockListeners = {
    type: keyof HTMLElementEventMap
    handler: (e?: Event | undefined) => void
}
export type Constructor<T = object> = new (...args: any[]) => T
export type ExtendedBlock = {
    holder: HTMLElement | null
    actions: BlockActions
    state: BlockState
    meta: BlockMeta
    flags: BlockFlags
    tools: BlockTools
    handlers: BlockHandler[]
    listeners: BlockListeners[]
}

export type InlineTools = 'Bold' | 'Italic' | 'Link'
