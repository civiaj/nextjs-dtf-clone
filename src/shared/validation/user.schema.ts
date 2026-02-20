import { z } from 'zod'
import { TextValidation } from '@/shared/utils/text.utils'
import { idParam } from '@/shared/validation/common.schema'

export const searchUserSchema = z.object({
    query: z.string().min(1, 'Поле не должно быть пустым')
})

const emailSchema = z
    .string({ message: 'Некорректный адрес электронной почты' })
    .email({ message: 'Некорректный адрес электронной почты' })

const passwordSchema = z
    .string({ message: 'Пароль должен содержать не менее 6 символов' })
    .min(6, { message: 'Пароль должен содержать не менее 6 символов' })
    .max(50, { message: 'Пароль должен содержать не более 50 символов' })

const nameSchema = z.preprocess(
    (v) => TextValidation.normalizeRegularText(v),
    z
        .string()
        .min(5, { message: 'Имя должно содержать не менее 5 символов' })
        .max(50, {
            message: `Имя должно содержать не более ${50} символов`
        })
)

const descriptionSchema = z.preprocess(
    (v) => TextValidation.normalizeRegularText(v),
    z
        .string()
        .trim()
        .max(255, {
            message: `Описание должно содержать не более ${255} символов`
        })
)

const confirmPasswordSchema = z
    .string({ message: 'Подтверждение пароля должно содержать не менее 6 символов' })
    .min(6, { message: 'Подтверждение пароля должно содержать не менее 6 символов' })
    .max(50, { message: 'Подтверждение пароля должно содержать не более 50 символов' })

export const signUpSchema = z
    .object({
        name: nameSchema,
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: confirmPasswordSchema
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Пароли не совпадают'
    })

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema
})

export const patchUserSchema = z.object({
    name: nameSchema.optional(),
    description: descriptionSchema.optional(),
    avatarId: z.number().positive().nullable().optional(),
    coverId: z.number().positive().nullable().optional(),
    coverY: z.number().min(0).max(100).nullable().optional()
})

export const getUserSchema = z.object({
    id: idParam
})

export const getOwnerMutedUsersSchema = z.object({
    type: z.literal('owner-muted-users'),
    cursor: idParam.optional()
})
export const getUserFollowersSchema = z.object({
    type: z.literal('user-followers'),
    userId: idParam,
    cursor: idParam.optional()
})
export const getUserSubscriptionsSchema = z.object({
    type: z.literal('user-subscriptions'),
    userId: idParam,
    cursor: idParam.optional()
})
export const getUsersSchema = z.discriminatedUnion('type', [
    getOwnerMutedUsersSchema,
    getUserFollowersSchema,
    getUserSubscriptionsSchema
])

export type SignUpSchemaInput = z.infer<typeof signUpSchema>
export type LoginSchemaInput = z.infer<typeof loginSchema>
export type PatchUserSchemaInput = z.infer<typeof patchUserSchema>

export type GetOwnerMutedUsersInput = z.infer<typeof getOwnerMutedUsersSchema>
export type GetOwnerMutedUsersDTO = GetOwnerMutedUsersInput

export type GetUserSubscriptionsInput = z.infer<typeof getUserSubscriptionsSchema>
export type GetUserSubscriptionsDTO = GetUserSubscriptionsInput

export type GetUserFollowersInput = z.infer<typeof getUserFollowersSchema>
export type GetUserFollowersDTO = GetUserFollowersInput

export type GetUserInput = z.infer<typeof getUserSchema>
export type GetUserDTO = GetUserInput

export type GetUsersInput = z.infer<typeof getUsersSchema>
export type GetUsersDTO = GetUsersInput
