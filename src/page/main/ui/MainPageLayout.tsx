import { Container, ContainerPadding } from '@/shared/ui/box'
import { LinksBar } from '@/shared/ui/LinksBar'
import { MainPageSortDropdown } from './MainPageSortDropdown'
import { MAIN_PAGE_NAV_LINKS } from '../model/page-nav-links'

export const MainPageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='no-radius-first-container no-radius-first-skeleton'>
            <Container
                className='mb-0 border-b border-border md:mb-0 md:rounded-bl-none md:rounded-br-none'
                withBottom={false}>
                <ContainerPadding
                    withTop={false}
                    className='flex items-center justify-between gap-4'>
                    <LinksBar
                        items={MAIN_PAGE_NAV_LINKS}
                        linkItemClassName='py-4'
                    />
                    <MainPageSortDropdown />
                </ContainerPadding>
            </Container>
            {children}
        </div>
    )
}
