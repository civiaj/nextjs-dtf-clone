import { memo, useEffect, useState } from 'react'
import EditorJS from '@editorjs/editorjs'
import { Button } from '@/shared/ui/button'

export const AddTitleButton = memo(
    ({ holder, instance }: { holder: string; instance: EditorJS | null }) => {
        const [hasTitle, setHasTitle] = useState(() => getHasTitle(instance))

        const handleAddTitle = () => {
            instance?.blocks.insert('heading', { level: 1 }, {}, 0, true, false)
        }

        useEffect(() => {
            const mo = new MutationObserver(() => {
                setHasTitle(() => getHasTitle(instance))
            })
            const editor = document.querySelector(`#${holder}`)

            if (!editor) return

            mo.observe(editor, { attributes: false, childList: true, subtree: true })

            return () => {
                mo.disconnect()
            }
        }, [instance, holder])

        if (hasTitle) return null

        return (
            <div className='ce-block__content'>
                <Button
                    className='p-0 font-medium text-active'
                    size={'md'}
                    variant={'clean'}
                    onClick={handleAddTitle}>
                    Добавить заголовок
                </Button>
            </div>
        )
    }
)

AddTitleButton.displayName = 'AddTitleButton'

const getHasTitle = (instance: EditorJS | null) => {
    if (!instance) return false

    const block = instance.blocks.getBlockByIndex(0)

    if (!block) return false

    return block.holder.querySelector('h1') !== null
}
