export function mergeRefs<T>(
    ...inputRefs: Array<React.Ref<T> | ((instance: T | null) => void) | null | undefined>
): (ref: T | null) => void {
    return (ref: T | null) => {
        inputRefs.forEach((inputRef) => {
            if (!inputRef) {
                return
            }

            if (typeof inputRef === 'function') {
                inputRef(ref)
            } else if (inputRef && 'current' in inputRef) {
                ;(inputRef as React.MutableRefObject<T | null>).current = ref
            }
        })
    }
}
