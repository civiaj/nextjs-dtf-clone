import { TComment } from '@/shared/types/comment.types'

export const buildLinearOrderFromTree = (
    tree: Record<string, TComment['id'][]>,
    expandedIds: Record<string, boolean>
) => {
    const result: TComment['id'][] = []

    const traverse = (parentId: TComment['parentId']) => {
        const key = String(parentId)
        const children = tree[key]

        if (!expandedIds[key] || !children) return

        for (const id of children) {
            result.push(id)
            traverse(id)
        }
    }

    traverse(null)
    return result
}

export const getRemainingRepliesCount = (
    adapterEntities: Record<number, TComment>,
    treeIds: Record<string, TComment['id'][]>,
    options: { id: TComment['id'] | null; totalCount?: number }
) => {
    const { id, totalCount } = options
    const branch = treeIds[String(id)] ?? []

    const branchReplyCount = branch.reduce(
        (acc, id) => (acc += 1 + (adapterEntities[id]?.replyCount ?? 0)),
        0
    )

    if (id !== null) {
        return Math.max((adapterEntities[id]?.replyCount ?? 0) - branchReplyCount, 0)
    }

    if (typeof totalCount === 'undefined') {
        console.error('totalCount is required when id is null')
        return 0
    }

    return Math.max(totalCount - branchReplyCount, 0)
}
