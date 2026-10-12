import type { FastifyInstance } from 'fastify'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { signup, signin } from '@somnadh/blog'
import { createUser, validateUserCredentials } from '../services/auth.service'
import { requireAuth } from '../middleware/auth.middleware'

export async function authRoutes(app: FastifyInstance) {
    app.post('/signup', async (request, reply) => {
        const result = signup.safeParse(request.body)

        if (!result.success) {
        return reply.code(400).send({
            message: 'Invalid signup details',
            errors: result.error.flatten()
        })
        }

        try {
        const user = await createUser(result.data)

        return reply.code(201).send({
            message: 'Account created successfully',
            user
        })
        } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return reply.code(409).send({
            message: 'An account with this email already exists'
            })
        }

        request.log.error(error, 'Signup failed')

        return reply.code(500).send({
            message: 'Unable to create account'
        })
        }
    })

    app.post('/signin', async (request, reply) => {
    const result = signin.safeParse(request.body)

    if (!result.success) {
        return reply.code(400).send({
        message: 'Invalid signin details',
        errors: result.error.flatten()
        })
    }

    try {
        const user = await validateUserCredentials(result.data)

        if (!user) {
        return reply.code(401).send({
            message: 'Invalid credentials'
        })
        }

        const token = await reply.jwtSign(
        { id: user.id },
        { expiresIn: '1h' }
        )

        return reply
        .setCookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60
        })
        .code(200)
        .send({
            message: 'Login successful',
            user
        })
    } catch (error) {
        request.log.error(error, 'Signin failed')

        return reply.code(500).send({
        message: 'Unable to sign in'
        })
    }
    })

    app.get('/me', {
    preHandler: requireAuth
    }, async (request, reply) => {
    const user = await prisma.user.findUnique({
        where: {
        id: request.user.id
        },
        select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
        }
    })

    if (!user) {
        return reply.code(401).send({
        message: 'Unauthorized'
        })
    }

    return reply.send({ user })
    })

    app.post('/logout', async (_request, reply) => {
    return reply
        .clearCookie('access_token', {
        path: '/'
        })
        .code(200)
        .send({
        message: 'Logged out successfully'
        })
    })
    }