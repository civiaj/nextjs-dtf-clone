import { z } from 'zod'

export const idParam = z.preprocess((val) => {
    if (typeof val === 'string') return Number(val)
    return val
}, z.number().int().positive().max(Number.MAX_SAFE_INTEGER))
