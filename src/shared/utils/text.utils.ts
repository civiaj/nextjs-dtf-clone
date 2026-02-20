import { decode } from 'he'
import sanitizeHtml from 'sanitize-html'

export class TextValidation {
    static normalizeRegularText(raw: unknown) {
        if (typeof raw !== 'string') return ''

        const cleaned = sanitizeHtml(raw, {
            allowedTags: [],
            allowedAttributes: {}
        })

        const decoded = decode(cleaned)

        let normalized = decoded.replace(/\r?\n+/g, ' ')
        normalized = normalized.replace(/\s{2,}/g, ' ')
        return normalized.trim()
    }

    static normalizeCaption(raw: unknown) {
        if (typeof raw !== 'string') return ''

        const cleaned = sanitizeHtml(raw, {
            allowedTags: ['b', 'i', 'a'],
            allowedAttributes: { a: ['href', 'target', 'rel'] },
            transformTags: {
                a: (_tagName, attribs) => {
                    return {
                        tagName: 'a',
                        attribs: {
                            href: attribs.href,
                            target: '_blank',
                            rel: 'nofollow'
                        }
                    }
                }
            }
        })

        const decoded = decode(cleaned)

        let normalized = decoded.replace(/&nbsp;/g, ' ')
        normalized = normalized.replace(/\s{2,}/g, ' ')
        normalized = normalized.replace(/(\r?\n)+/g, ' ')

        return normalized.trim()
    }

    static normalizeListItem(raw: unknown) {
        if (typeof raw !== 'string') return ''

        const cleaned = sanitizeHtml(raw, {
            allowedTags: ['b', 'i', 'a'],
            allowedAttributes: { a: ['href', 'target', 'rel'] },
            transformTags: {
                a: (_tagName, attribs) => {
                    return {
                        tagName: 'a',
                        attribs: {
                            href: attribs.href,
                            target: '_blank',
                            rel: 'nofollow'
                        }
                    }
                }
            }
        })

        const decoded = decode(cleaned)

        let normalized = decoded.replace(/&nbsp;/g, ' ')
        normalized = normalized.replace(/(\r?\n\s*){2,}/g, '\n')
        normalized = normalized.replace(/[^\S\r\n]{2,}/g, ' ')
        return normalized.trim()
    }

    static normalizeCode(raw: unknown) {
        if (typeof raw !== 'string') return ''

        const cleaned = sanitizeHtml(raw, {
            allowedTags: [],
            allowedAttributes: {}
        })
        const decoded = decode(cleaned)

        return decoded
    }

    static normalizeWithTags(raw: unknown) {
        if (typeof raw !== 'string') return ''

        const cleaned = sanitizeHtml(raw, {
            allowedTags: ['b', 'i', 'a', 'br'],
            allowedAttributes: { a: ['href', 'target', 'rel'] },
            transformTags: {
                a: (_tagName, attribs) => {
                    return {
                        tagName: 'a',
                        attribs: {
                            href: attribs.href,
                            target: '_blank',
                            rel: 'nofollow'
                        }
                    }
                }
            }
        })

        const decoded = decode(cleaned)

        let normalized = decoded.replace(/&nbsp;/g, ' ')
        normalized = normalized.replace(/\s{2,}/g, ' ')
        normalized = normalized.replace(/(<br\s*\/?>\s*){2,}/gi, '<br>')
        return normalized.trim()
    }

    static getLengthWithoutTags(html: string) {
        const plainText = html.replace(/<[^>]*>/g, '')
        return plainText.length
    }
}
