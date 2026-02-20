import { DraftDetailsPage } from '@/page/drat'

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params

    return <DraftDetailsPage id={+params.id} />
}
