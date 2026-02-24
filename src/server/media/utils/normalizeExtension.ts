const EXTENSION_NORMALIZATION_MAP: Record<string, string> = {
    jpg: 'jpeg'
}

export const normalizeExtension = (extension: string): string => {
    const normalized = extension.trim().toLowerCase()
    return EXTENSION_NORMALIZATION_MAP[normalized] ?? normalized
}
