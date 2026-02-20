import { CommentItemSkeleton } from '@/entities/comment'
import { Container, ContainerPadding } from '@/shared/ui/box'

export const UserCommentsListSkeleton = () => {
    return Array.from({ length: 10 }).map((_, i) => (
        <Container key={i}>
            <ContainerPadding>
                <CommentItemSkeleton />
            </ContainerPadding>
        </Container>
    ))
}
