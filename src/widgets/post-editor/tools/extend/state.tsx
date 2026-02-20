import { BlockAPI } from '@editorjs/editorjs'
import { CommonToolData } from '@/entities/editor'
import BlockMeta from './meta'

const globalState: GlobalState = {
    openId: null,
    hiddenIds: new Set(),
    coverIds: new Set(),
    stateRegistry: new Map()
}

const stateRegistry = new Map<string, BlockState>()

export default class BlockState extends EventTarget {
    block: BlockAPI
    data: unknown
    meta: BlockMeta

    constructor({ block, data, meta }: { block: BlockAPI; data: unknown; meta: BlockMeta }) {
        super()
        this.block = block
        this.meta = meta

        if (this.block && isStateData(data)) {
            this.setHidden(data.isHidden)
            this.setCover(data.isCover)
        }

        stateRegistry.set(block.id, this)
    }

    setHidden(v: boolean | null | undefined) {
        const has = globalState.hiddenIds.has(this.block.id)

        if (!has && v) {
            globalState.hiddenIds.add(this.block.id)
            this.enqueueUpdate('state-update')
        } else if (has && !v) {
            globalState.hiddenIds.delete(this.block.id)
            this.enqueueUpdate('state-update')
        }
    }

    setCover(v: boolean | null | undefined) {
        const has = globalState.coverIds.has(this.block.id)

        if (!has && v) {
            const max = 3

            if (globalState.coverIds.size >= max) {
                return
            }

            globalState.coverIds.add(this.block.id)
            this.enqueueUpdate('state-update')
        } else if (has && !v) {
            globalState.coverIds.delete(this.block.id)
            this.enqueueUpdate('state-update')
        }
    }

    setOpenId(v: string | null) {
        if (v !== globalState.openId) {
            globalState.openId = v
            this.enqueueUpdate('tools-open')
        }
    }

    get isHidden() {
        return globalState.hiddenIds.has(this.block.id)
    }
    get isCover() {
        return globalState.coverIds.has(this.block.id)
    }

    get openId() {
        return globalState.openId
    }

    toggleOpenId(id: string) {
        this.setOpenId(globalState.openId === id ? null : id)
    }

    isOpen(id: string | null) {
        return globalState.openId === id
    }

    private enqueueUpdate(eventName: StateEvent) {
        try {
            this.block.dispatchChange()
        } catch {}
        this.dispatchEvent(new Event(eventName))
    }

    destroy() {
        this.setHidden(false)
        this.setCover(false)
        stateRegistry.delete(this.block.id)
    }

    destroyById(id: string) {
        stateRegistry.get(id)?.destroy()
    }
}

const isStateData = (data: unknown): data is CommonToolData => {
    return (
        typeof data === 'object' &&
        data !== null &&
        'isCover' in data &&
        typeof data.isCover === 'boolean' &&
        'isHidden' in data &&
        typeof data.isHidden === 'boolean'
    )
}

type GlobalState = {
    openId: string | null
    hiddenIds: Set<string>
    coverIds: Set<string>
    stateRegistry: Map<string, BlockState>
}
type StateEvent = 'state-update' | 'tools-open'
