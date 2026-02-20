import { LucideProps } from 'lucide-react'

export type TSidebarItem = {
    href: string
    label: string
    Icon: React.ComponentType<LucideProps>
    match: (pathname: string) => boolean
}
