import { UserPageLayout } from '@/page/user'

export default async function Layout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ id: string }>
}) {
    return <UserPageLayout id={(await params).id}>{children}</UserPageLayout>
}
