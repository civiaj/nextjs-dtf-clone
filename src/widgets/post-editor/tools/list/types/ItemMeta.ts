export interface ItemMetaBase {
    __kind?: 'ordered' | 'unordered'
}
export interface OrderedListItemMeta extends ItemMetaBase {
    __kind?: 'ordered'
}
export interface UnorderedListItemMeta extends ItemMetaBase {
    __kind?: 'unordered'
}
export type ItemMeta = OrderedListItemMeta | UnorderedListItemMeta
