import { focus } from '@editorjs/caret'
import { getItemContentElement } from './getItemContentElement'
import type { ItemElement } from '../types/Elements'

/**
 * Sets focus to the item's content
 * @param item - item (<li>) to select
 * @param atStart - where to set focus: at the start or at the end
 */
export function focusItem(item: ItemElement, atStart: boolean = true): void {
    const itemContent = getItemContentElement(item)

    if (!itemContent) {
        return
    }

    focus(itemContent, atStart)
}
