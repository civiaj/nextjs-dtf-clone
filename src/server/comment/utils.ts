import { MentionNodeAttrs } from '@tiptap/extension-mention'
import { Node as PMNode, Schema } from 'prosemirror-model'
import { ApiError } from '@/lib/error'
import { ERROR_MESSAGES } from '@/shared/constants'
import { schema } from '@/shared/services/tiptap'
import { TUser } from '@/shared/types/user.types'
import { JSONContent } from './types'

const MAX_DEPTH = 10
const MAX_CHARS = 1500

class CommentDocumentHandler {
    constructor(private schema: Schema) {
        this.schema = schema
    }

    transform(input?: string | null) {
        if (!input) return null

        try {
            const doc = JSON.parse(input)
            const node = PMNode.fromJSON(this.schema, doc)
            const normalized = this.normalize(node)
            normalized.check()
            return normalized.toJSON() as JSONContent
        } catch (error) {
            if (error instanceof ApiError) throw error
            return null
        }
    }

    extractMentionIds(root: JSONContent | null): TUser['id'][] {
        if (!root) return []
        const result: TUser['id'][] = []

        const visit = (node: JSONContent): void => {
            if (this.isMentionNode(node)) {
                const id = Number(node.attrs.id)
                if (Number.isInteger(id)) {
                    result.push(id)
                }
            }

            node.content?.forEach(visit)
        }

        visit(root)
        return result
    }

    private normalize(node: PMNode): PMNode {
        let charCount = 0

        const traverse = (node: PMNode, depth: number, parent?: PMNode): PMNode | null => {
            // if (nodeCount >= MAX_NODES) {
            //     throw ApiError.BadRequest(ERROR_MESSAGES.COMMENT.TOO_MANY_NODES)
            // }

            if (depth >= MAX_DEPTH) {
                throw new Error('Comment is too deep')
            }

            if (node.isText) {
                const text = node.text?.replace(/ {2,}/g, ' ')
                if (!text) return null

                const trimmed = text.trim()
                if (!trimmed && parent && parent.children.length <= 1) {
                    return null
                }

                charCount += text.length
                if (charCount >= MAX_CHARS) {
                    throw ApiError.BadRequest(ERROR_MESSAGES.COMMENT.TOO_MANY_CHARS)
                }

                return node.type.schema.text(text, node.marks)
            }

            const children: PMNode[] = []

            for (const child of node.children) {
                const normalized = traverse(child, depth + 1, node)
                if (normalized) children.push(normalized)
            }

            if (['paragraph', 'blockquote'].includes(node.type.name) && children.length === 0) {
                return null
            }

            return node.type.create(node.attrs, children, node.marks)
        }

        const normalized = traverse(node, 0)
        if (!normalized) {
            // throw ApiError.BadRequest(ERROR_MESSAGES.COMMENT.IS_EMPTY)
            throw Error()
        }

        normalized.check()
        return normalized
    }

    private isMentionNode(node: JSONContent): node is JSONContent & { attrs: MentionNodeAttrs } {
        return (
            node.type === 'mention' &&
            typeof node.attrs === 'object' &&
            node.attrs !== null &&
            typeof node.attrs.id === 'string'
        )
    }
}

export const commentDocumentHandler = new CommentDocumentHandler(schema)
