import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from 'uuid'

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs))
}

export const createLocalId = () => {
    const currentTime = Date.now().toString(36)
    const randomPart = Math.random().toString(36).slice(2, 7)
    return currentTime.concat('-', randomPart)
}

export function validateUrl(url: string): boolean {
    const urlPattern =
        /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/

    if (!url) {
        return false
    }

    return urlPattern.test(url)
}

export const generateUUID = () => {
    return uuidv4()
}

export const formatMediaDuration = (s: number) => {
    const minutes = Math.floor(s / 60)
    const seconds = Math.floor(s % 60)
    const pad = (num: number) => String(num).padStart(2, '0')
    return `${pad(minutes)}:${pad(seconds)}`
}

export function parseId(param: string | null): number | null {
    if (!param) return null
    const num = Number(param)
    return Number.isNaN(num) ? null : num
}
