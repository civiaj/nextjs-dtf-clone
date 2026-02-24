export const PATH = {
    MAIN: '',
    MAIN_POPULAR: '/popular',
    MAIN_NEW: '/new',
    MAIN_SELF: '/my',
    POST: '/post',
    USER: '/user',
    SETTINGS: '/settings',
    SETTINGS_BLOG: '/settings/blog',
    SETTINGS_FEED: '/settings/feed',
    SETTINGS_GENERAL: '/settings/general',
    EDITOR: '/editor',
    DRAFT: '/draft',
    BOOKMARKS: '/bookmarks',
    BOOKMARKS_REACTIONS: '/reactions'
} as const

export const MAX_FILE_SIZE = 20 * 1024 * 1024
export const MIN_FILE_HEIGHT_PX = 25
export const MIN_FILE_WIDTH_PX = 25
export const MAX_VIDEO_DURATION = 6000
export const MAX_AVATAR_DURATION = 2

export const ERROR_MESSAGES = {
    MEDIA: {
        BIG_SIZE: `Ошибка загрузки файла. Максимальный размер: ${MAX_FILE_SIZE / 1024 / 1024} мб.`,
        WRONG_FORMAT: (format: string = 'неизвестно') =>
            `Ошибка загрузки файла. Неподдерживаемый формат файла: ${format}.`,
        NO_RESOLUTION: 'Ошибка загрузки файла. Не удалось определить разрешение.',
        DIMENSION_TOO_SMALL: `Ошибка загрузки файла. Минимальное разрешение: ${MIN_FILE_WIDTH_PX}x${MIN_FILE_HEIGHT_PX}.`,
        BIG_DURATION: `Ошибка загрузки файла. Максимальная продолжительность: ${MAX_VIDEO_DURATION} секунд.`,
        NO_FILE: 'Ошибка загрузки файла. Файл не найден.',
        NO_META: 'Ошибка загрузки файла. Не удалось получить информацию о файле.',
        NOT_FOUND: 'Файл не найден.',
        PROCESSING_ERROR: 'Произошла ошибка при обработке файла.'
    },
    USER: {
        EMAIL_NOT_FOUND: 'Неверный email или пароль.',
        USER_EXIST: 'Пользователь с указанным адресом электронной почты уже существует.',
        TOKEN_NOT_FOUND: 'Пользователь неавторизован.',
        TOKEN_EXPIRED: 'Токен недействителен или истек.',
        USER_NOT_CREATED: 'Пользователь не создан.',
        USER_NOT_UPDATED: 'Пользователь не обновлен.',
        USER_NOT_FOUND: 'Пользователь не удалён.',
        NOT_FOUND: 'Пользователь не найден.'
    },
    DRAFT: {
        NOT_FOUND: 'Черновик не найден.',
        EMPTY_CONTENT: 'Содержимое черновика не может быть пустым.'
    },
    POST: {
        NOT_FOUND: 'Страница не найдена.',
        NOT_ENOUGH_RIGHTS: 'У вас нет прав для удаления этого поста.'
    },
    PARAMS: {
        NOT_FOUND: 'Страница не найдена.',
        NUMBER: (name: string) => `Параметр ${name} должен быть положительным целым числом.`
    },
    USER_SUBSCRIPTION: {
        SAME: 'Нельзя подписаться на самого себя.',
        ALREADY_EXISTS: 'Вы уже подписаны на этого пользователя.',
        NOT_EXISTS: 'Вы не подписаны на этого пользователя.'
    },
    MUTE: {
        SELF_BLOCK: 'SELF_BLOCK',
        ALREADY_EXISTS: 'ALREADY_EXISTS',
        NOT_EXISTS: 'NOT_EXISTS',
        INVALID_ACTION: 'INVALID_ACTION',
        IS_MUTED: 'IS_MUTED'
    },
    COMMENT: {
        NOT_FOUND: 'Комментарий не найден.',
        NOT_ENOUGH_RIGHTS: 'У вас нет прав для удаления этого комментария.',
        ALREADY_DELETED: 'Комментарий уже удалён.',
        INVALID_USER_IDS: 'Неверные идентификаторы пользователей.',
        MUTED_ME: 'Вы не можете комментировать пользователя, который вас заблокировал.',
        TOO_MANY_NODES: 'TOO_MANY_NODES',
        TOO_MANY_CHARS: 'TOO_MANY_CHARS',
        IS_EMPTY: 'IS_EMPTY'
    },
    REACTION: {
        EITHER: 'Пожалуйста, выберите либо комментарий, либо пост.',
        UNKNOWN_REACTABLE_TYPE: (type: string) => `Неизвестный тип реактируемого контента: ${type}`,
        VALUE_NOT_FOUND: 'Несуществующее значение реакции.'
    }
}
