import { MainPageLayout } from '@/page/main'

export default async function Layout({ children }: { children: React.ReactNode }) {
    return <MainPageLayout>{children}</MainPageLayout>
}
