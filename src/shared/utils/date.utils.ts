export const getSinceDate = (dateStr: string | Date): string => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMin / 60)

    const isToday = now.toDateString() === date.toDateString()
    const isYesterday =
        new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString()

    if (diffMin < 6) {
        return 'сейчас'
    } else if (diffMin < 60) {
        return `${diffMin} мин`
    } else if (diffHours < 5) {
        return `${diffHours} ч`
    } else if (isToday) {
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    } else if (isYesterday) {
        return 'вчера'
    } else if (now.getFullYear() === date.getFullYear()) {
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })
    } else {
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }
}

export const getFromDate = (dateStr: string | Date) => {
    const months = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря'
    ]
    const date = new Date(dateStr)
    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()

    return `с ${day} ${month} ${year} года`
}

export const getAtDate = (date: Date | string, separtor = ' в') =>
    new Date(date)
        .toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
        .replace(',', separtor)
