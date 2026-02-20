import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const useAuthModalActions = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const closeModal = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('modal')
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return { closeModal }
}
