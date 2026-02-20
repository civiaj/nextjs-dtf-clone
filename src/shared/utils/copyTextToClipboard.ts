export const copyTextToClipboard = async (text: string) => {
    try {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text)
            return
        }
        await navigator.clipboard.writeText(text)
    } catch (error) {
        console.warn('Copy failed', error)
    }
}

function fallbackCopyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea')
    textArea.value = text

    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    document.execCommand('copy')

    document.body.removeChild(textArea)
}
