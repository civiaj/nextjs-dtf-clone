import { EditorBlocks, EditorData } from '@/entities/editor'

export function processData(blocks?: EditorBlocks): EditorData {
    let processedBlocks: EditorData['blocks'] = []

    if (!blocks) {
        processedBlocks = [
            {
                type: 'heading',
                data: { text: '', level: 1, isCover: false, isHidden: false }
            }
        ]
    } else if (blocks[0]?.type !== 'heading') {
        processedBlocks = [
            {
                type: 'heading',
                data: { text: '', level: 1, isCover: false, isHidden: false }
            },
            ...(blocks as EditorData['blocks'])
        ]
    } else {
        processedBlocks = blocks as EditorData['blocks']
    }

    return { time: 0, version: '', blocks: processedBlocks }
}
