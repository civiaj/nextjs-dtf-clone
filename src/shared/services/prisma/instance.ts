import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prismaClientSingleton = () => {
    return new PrismaClient().$extends({
        query: {
            user: {
                async $allOperations({ operation, args, query }) {
                    if (['create', 'update'].includes(operation) && 'data' in args)
                        if (Array.isArray(args.data)) {
                            for (const userData of args.data) {
                                if (userData.password) {
                                    userData.password = await bcrypt.hash(userData.password, 10)
                                }
                            }
                        } else if (args.data?.password) {
                            args.data.password = await bcrypt.hash(args.data.password as string, 10)
                        }

                    return query(args)
                }
            }
        }
    })
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
export default prisma
