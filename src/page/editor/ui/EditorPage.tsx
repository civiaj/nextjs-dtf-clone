'use client'

import { Container } from '@/shared/ui/box'
import { PostEditor } from '@/widgets/post-editor'

export const EditorPage = () => {
    return (
        <Container className='mb-0 flex h-[calc(100dvh-var(--navbar-height)-var(--mobile-sidebar-height))] flex-col md:h-[calc(100dvh-var(--navbar-height)-var(--mobile-sidebar-height)-2rem)] lg:h-[calc(100dvh-var(--navbar-height)-2rem)]'>
            <PostEditor />
        </Container>
    )
}
