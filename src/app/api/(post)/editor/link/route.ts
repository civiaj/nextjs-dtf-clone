import * as cheerio from 'cheerio'
import { NextRequest, NextResponse } from 'next/server'
import { ApiError, apiErrorHandler } from '@/lib/error'
import { mediaService } from '@/server/composition-root'
import { AuthContext } from '@/server/context'

export async function GET(req: NextRequest) {
    try {
        const user = await AuthContext.getCurrentUser()
        try {
            const url = req.nextUrl.searchParams.get('url')

            if (!url) throw ApiError.BadRequest('Неверная ссылка')

            const response = await fetch(url)
            const html = await response.text()
            const $ = cheerio.load(html)
            const description =
                $('meta[property="og:description"]').attr('content') ??
                $('meta[name="description"]').attr('content') ??
                ''
            const hostname = new URL(url).hostname
            const title = $('meta[property="og:title"]').attr('content') ?? $('title').text() ?? url
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
            const fetchResponse = await fetch(faviconUrl)
            const blob = await fetchResponse.blob()
            const file = new File([blob], 'favicon.png', { type: blob.type })

            let image

            try {
                image = (await mediaService.upload({ file }, user.id)).result
            } catch (error) {
                console.log({ error })
            }

            const result = { description, hostname, image, title, url }

            return NextResponse.json({ result, message: 'success' })
        } catch {
            throw ApiError.BadRequest(
                'По вашему запросу ничего не найдено. Убедитесь, что ссылка правильная.'
            )
        }
    } catch (error) {
        return apiErrorHandler(error)
    }
}
