import { Metadata } from 'next'
import Link from 'next/link'
import { PATH } from '@/shared/constants'
import { Container, ContainerPadding } from '@/shared/ui/box'
import { Text } from '@/shared/ui/text'

export const metadata: Metadata = {
    title: 'Страница не найдена — 404',
    description:
        'К сожалению, запрошенная страница не найдена. Проверьте URL или вернитесь на главную.',
    robots: {
        index: false
    }
}

export default function NotFound(_: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <Container>
            <ContainerPadding className='flex min-h-40 flex-1 flex-col justify-between'>
                <section>
                    <Text as='h2'>Страница не найдена</Text>
                    <Text as='p'>
                        К сожалению, запрошенная страница не существует или была удалена.
                    </Text>
                </section>
                <Link
                    className='mt-6 self-start text-active'
                    href={PATH.MAIN_POPULAR}>
                    Вернуться на главную
                </Link>
            </ContainerPadding>
        </Container>
    )
}
