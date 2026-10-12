import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'

interface CreateUserInput {
    name: string
    email: string
    password: string
}

interface SignInInput {
    email: string
    password: string
    }

export async function createUser(input: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(input.password, 10)

    const user = await prisma.user.create({
    data: {
        name: input.name.toLowerCase(),
        email: input.email.toLowerCase(),
        password: hashedPassword
        },
    select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
    }
    })

    return user
}

export async function validateUserCredentials(input: SignInInput) {
    const user = await prisma.user.findUnique({
        where: {
        email: input.email.toLowerCase()
        }
    })

    if (!user) {
        return null
    }

    const passwordMatches = await bcrypt.compare(
        input.password,
        user.password
    )

    if (!passwordMatches) {
        return null
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email
    }
    }

export async function getHomePageDetails(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            userImage: true
        }
    })

    return user
}