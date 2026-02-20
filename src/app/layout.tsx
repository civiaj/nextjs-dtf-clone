import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Providers } from '@/app/providers'
import { AssetsFetcher } from '@/entities/assets'
import { OwnerFetcher } from '@/entities/auth'
import { Toaster } from '@/shared/ui/toaster'
import { AuthModal } from '@/widgets/auth-modal'
import { NavigationBar } from '@/widgets/navigation-bar'
import { Sidebar } from '@/widgets/sidebar'
import './globals.css'

const geist = Geist({
    subsets: ['latin'],
    display: 'swap'
})

export const metadata: Metadata = {
    title: 'Главная',
    description: ''
}

export const viewport: Viewport = {
    initialScale: 1,
    maximumScale: 1,
    width: 'device-width'
}

export const dynamic = 'force-dynamic'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang='ru'>
            <body className={`${geist.className} bg-background text-primary`}>
                <Providers>
                    <NavigationBar />
                    <div id='root'>
                        <Sidebar />
                        <div className='col-start-1 col-end-2 mx-auto mb-[var(--mobile-sidebar-height)] h-full w-full max-w-3xl pt-0 md:pt-4 lg:col-start-2 lg:col-end-3 lg:mb-0'>
                            {children}
                        </div>
                    </div>

                    <OwnerFetcher />
                    <AssetsFetcher />
                    <AuthModal />
                    <Toaster />
                    <div id='modal' />
                </Providers>
            </body>
        </html>
    )
}
