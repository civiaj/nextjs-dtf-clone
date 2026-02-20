export const DefaultListCssClasses = {
    wrapper: 'cdx-list',
    item: `cdx-list__item`,
    itemContent: `cdx-list__item-content`,
    itemChildren: `cdx-list__item-children`
}

export interface ListCssClasses {
    wrapper: string
    item: string
    itemContent: string
    itemChildren: string
}

export interface ListRendererInterface<ItemMeta> {
    renderWrapper: (isRoot: boolean) => HTMLElement
    renderItem: (content: string, meta: ItemMeta) => HTMLElement
    getItemContent: (item: Element) => string
    getItemMeta: (item: Element) => ItemMeta
    composeDefaultMeta: () => ItemMeta
}
