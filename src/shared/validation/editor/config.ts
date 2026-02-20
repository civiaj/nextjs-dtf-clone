export const EDITOR_LIMIT = {
    HEADING: {
        H1: {
            LENGTH: 255
        },
        OTHER: {
            LENGTH: 2000
        }
    },
    PARAGRAPH: {
        LENGTH: 5000
    },
    CODE: {
        LENGTH: 5000
    },
    LIST: {
        LENGTH: 5000
    },
    QUOTE: {
        LENGTH: 5000
    },
    MEDIA: {
        LENGTH: 1000,
        ITEMS: 10
    },
    BLOCK: {
        ITEMS: 100,
        COVER: 2
    }
} as const
