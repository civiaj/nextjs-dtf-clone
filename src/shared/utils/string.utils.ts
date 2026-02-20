export const formatTextSpacing = <T extends string | null>(str: T) => {
    if (str === null) return str
    return str
        .trimStart()
        .replace(/[\s]*\n[\s]*/g, '\n')
        .replace(/\n{2,}/g, '\n')
        .replace(/[ ]{2,}/g, ' ')
        .trimEnd()
}

export const getCompactTextLength = (htmlSring: string | null) => {
    if (!htmlSring) return 0
    return htmlSring.replace(/[\s\n]+/g, '').length
}

export const getCaretLength = (htmlString: string): number => {
    return htmlString.replace(/\n/g, ' ').length - 1
}

export const convertNewLinesToSpaces = (str: string) => {
    return str.replace(/\n/g, ' ')
}

export const addNewlineIfNeeded = (text: string, isRemove: boolean = false): string => {
    if (isRemove) {
        return text.endsWith('\n') ? text.slice(0, -1) : text
    }

    return text.endsWith('\n') ? text : text + '\n'
}

export const getNoun = (number: number, one: string, two: string, five: string) => {
    let n = Math.abs(number)

    n %= 100

    if (n >= 5 && n <= 20) {
        return five
    }

    n %= 10

    if (n === 1) {
        return one
    }

    if (n >= 2 && n <= 4) {
        return two
    }

    return five
}
