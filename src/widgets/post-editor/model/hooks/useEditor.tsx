import { useEffect, useRef, useState } from 'react'
import EditorJS from '@editorjs/editorjs'
import { EditorData } from '@/entities/editor'
import { EDITOR_TOOLS } from '../config'

export const useEditor = ({
    holder,
    onChange,
    data
}: {
    holder: string
    onChange: (data: EditorData) => void
    data?: EditorData
}) => {
    const editorInstanceRef = useRef<EditorJS | null>(null)
    const [isReady, setIsReady] = useState(false)
    const prev = useRef(stableStringify(data?.blocks ?? []))

    useEffect(() => {
        let isCancelled = false
        let debounceId: ReturnType<typeof setTimeout> | null = null
        let rafId: number | null = null

        const initEditor = () => {
            if (isCancelled || editorInstanceRef.current) {
                return
            }

            const holderElement = document.getElementById(holder)

            if (!holderElement) {
                rafId = requestAnimationFrame(initEditor)
                return
            }

            editorInstanceRef.current = new EditorJS({
                holder: holderElement,
                data,
                tools: EDITOR_TOOLS,
                async onChange(api) {
                    const data = await api.saver.save()

                    if (debounceId) {
                        clearTimeout(debounceId)
                    }

                    const n = normalize(data as EditorData)
                    const curr = stableStringify(n)

                    if (prev.current === curr) return
                    prev.current = curr

                    // хз как поменять время встроенного дебаунса, добавим свой
                    debounceId = setTimeout(() => {
                        onChange(data as EditorData)
                    }, 500)
                },

                onReady() {
                    const afterReady = () => {
                        document.querySelector('.ce-toolbar')?.remove()
                        document.querySelector('.codex-editor-overlay')?.remove()
                        document.querySelector('.ct')?.remove()
                        ;(document.activeElement as HTMLElement)?.blur()

                        if (!isCancelled) {
                            setIsReady(true)
                        }
                    }

                    setTimeout(afterReady, 0)
                }
            })
        }

        initEditor()

        return () => {
            isCancelled = true

            if (rafId) {
                cancelAnimationFrame(rafId)
            }

            if (editorInstanceRef.current?.destroy) {
                editorInstanceRef.current.destroy()
                editorInstanceRef.current = null
            }

            if (debounceId) {
                clearTimeout(debounceId)
            }

            setIsReady(false)
        }
        // update with key prop
    }, [holder])

    return { instance: editorInstanceRef.current, isReady, Component: () => <div id={holder} /> }
}

const normalize = (data: EditorData) => {
    return data.blocks.map((block) => {
        const { data, type } = block

        switch (block.type) {
            case 'heading': {
                return { data, type }
            }
            case 'paragraph': {
                return { data, type }
            }
            case 'code': {
                return { data, type }
            }
            case 'quote': {
                return { data, type }
            }
            case 'list': {
                const {
                    data: { isCover, isHidden, items, style },
                    type
                } = block

                return {
                    type,
                    data: {
                        style,
                        isCover,
                        isHidden,
                        items: items.map((i) => ({ content: i.content }))
                    }
                }
            }
            case 'link': {
                return { data, type }
            }
            case 'media': {
                return { data, type }
            }
            case 'separator': {
                return { data, type }
            }
        }
    })
}

function stableStringify(obj: unknown): string {
    if (Array.isArray(obj)) {
        return `[${obj.map(stableStringify).join(',')}]`
    } else if (obj && typeof obj === 'object') {
        const keys = Object.keys(obj).sort()
        return `{${keys.map((k) => `"${k}":${stableStringify(obj[k as keyof typeof obj])}`).join(',')}}`
    } else {
        return JSON.stringify(obj)
    }
}
