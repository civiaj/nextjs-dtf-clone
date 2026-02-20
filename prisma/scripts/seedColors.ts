import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const AVATAR_COLORS = [
    '#90BE6D', // Светло-зеленый
    '#43AA8B', // Бирюзово-зеленый
    '#2A9D8F', // Бирюзово-синий (новый)
    '#277DA1', // Синий
    '#0077B6', // Ярко-синий (новый)
    '#6A4C93', // Фиолетовый
    '#9B5DE5', // Лавандовый
    '#F15BB5', // Розово-пурпурный
    '#F72585', // Ярко-розовый
    '#FF595E', // Коралловый
    '#FF924C', // Абрикосовый
    '#FFB677', // Персиковый светлый
    '#F9C74F' // Лимонно-желтый
]

async function main() {
    console.log('Начинаем наполнение справочника цветов...')

    // Очищаем таблицу
    await prisma.avatarColor.deleteMany({})

    // Создаем записи цветов
    for (const colorValue of AVATAR_COLORS) {
        await prisma.avatarColor.create({
            data: {
                value: colorValue
            }
        })
    }

    console.log('Справочник цветов успешно заполнен!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
