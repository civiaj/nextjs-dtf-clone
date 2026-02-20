import bcrypt from 'bcryptjs'

export const comparePassword = (
    candidatePassword: string | null | undefined,
    hashedPassword: string | null | undefined
) => {
    if (!candidatePassword || !hashedPassword) return false
    return bcrypt.compareSync(candidatePassword, hashedPassword)
}
