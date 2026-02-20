import dynamic from 'next/dynamic'
import { LoadingDots } from '@/shared/ui/loading-indicator'

type ClientOnlyProps = { children: React.ReactNode }

const ClientOnly = (props: ClientOnlyProps) => {
    const { children } = props
    return children
}

export default dynamic(() => Promise.resolve(ClientOnly), {
    ssr: false,
    loading: () => (
        <div className='flex h-full w-full items-center justify-center'>
            <LoadingDots />
        </div>
    )
})
