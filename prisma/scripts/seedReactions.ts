import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const REACTIONS = [
    {
        name: 'heart',
        emoji: '/emojis/heart.svg'
    },
    {
        name: 'confused',
        emoji: '/emojis/confused.svg'
    },
    {
        name: 'sad',
        emoji: '/emojis/sad.svg'
    },
    {
        name: 'shocked',
        emoji: '/emojis/shocked.svg'
    },
    {
        name: 'smile',
        emoji: '/emojis/smile.svg'
    },
    {
        name: 'poop',
        emoji: '/emojis/poop.svg'
    },
    {
        name: 'clown',
        emoji: '/emojis/clown.svg'
    },
    {
        name: 'fire',
        emoji: '/emojis/fire.svg'
    },
    {
        name: 'skull',
        emoji: '/emojis/skull.svg'
    }
]

async function main() {
    console.log('Начинаем наполнение справочника реакций...')

    // Очищаем таблицу
    await prisma.reactionValue.deleteMany({})

    // Создаем записи
    for (const data of REACTIONS) {
        await prisma.reactionValue.create({ data })
    }

    console.log('Справочник реакций успешно заполнен!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
