import { DefaultListCssClasses } from '../ListRenderer'
import type { ItemChildWrapperElement, ItemElement } from '../types/Elements'

/**
 * Returns child wrapper element of the passed item
 * @param item - wrapper element would be got from this item
 */
export function getItemChildWrapper(item: ItemElement): ItemChildWrapperElement | null {
    return item.querySelector(`.${DefaultListCssClasses.itemChildren}`)
}
