import { getSchema } from '@tiptap/core'
import { createExtensions } from './extensions'

const schema = getSchema(createExtensions({ mode: 'schema' }))
export { schema }
