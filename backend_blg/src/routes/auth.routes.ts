import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { signup, signin } from '@somnadh/blog'
import { createUser, validateUserCredentials } from '../services/auth.service'
import { requireAuth } from '../middleware/auth.middleware'

export async function authRoutes(app: FastifyInstance) {

    // --------------------------------------------------
    // SIGNUP
    // Original Hono endpoint: POST /userdetails/signup
    // --------------------------------------------------

    app.post('/signup', async (request, reply) => {
        const result = signup.safeParse(request.body)

        if (!result.success) {
            return reply.code(200).type('text/plain').send(
                'Invalid inputs.'
            )
        }

        try {
            await createUser(result.data)

            return reply.code(200).type('text/plain').send(
                'Done'
            )
        } catch (error) {
            request.log.error(error, 'Signup failed')

            return reply.code(200).type('text/plain').send(
                'Error while creating account, Try again.'
            )
        }
    })

    // --------------------------------------------------
    // SIGNIN
    // Original Hono endpoint: POST /userdetails/signin
    // --------------------------------------------------

    app.post('/signin', async (request, reply) => {
        const result = signin.safeParse(request.body)

        if (!result.success) {
            return reply.code(200).send({
                message: 'Invalid inputs'
            })
        }

        try {
            const user = await validateUserCredentials(result.data)

            if (!user) {
                return reply.code(200).send({
                    message: 'Invalid credentials'
                })
            }

            const token = await reply.jwtSign({
                id: user.id
            }, {
                expiresIn: '1h'
            })

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
                    message: 'valid',
                    token
                })
        } catch (error) {
            request.log.error(error, 'Signin failed')

            return reply.code(200).send({
                message: 'Error while Signin, Try again.'
            })
        }
    })

    // --------------------------------------------------
    // JWT CHECK
    // Original Hono endpoint: GET /userdetails/jwtcheck
    // --------------------------------------------------

    app.get('/jwtcheck', async (request, reply) => {
        const token = request.cookies.access_token || ''

        return reply.code(200).send({
            token
        })
    })

    // --------------------------------------------------
    // JWT LOGOUT
    // Original Hono endpoint: GET /userdetails/jwtlogout
    // --------------------------------------------------

    app.get('/jwtlogout', async (_request, reply) => {
        return reply
            .clearCookie('access_token', {
                path: '/'
            })
            .code(200)
            .send({})
    })

    // --------------------------------------------------
    // CURRENT USER
    // Additional Fastify endpoint
    // --------------------------------------------------

    app.get('/me', {
        preHandler: requireAuth
    }, async (request, reply) => {
        try {
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

            return reply.code(200).send({
                user
            })
        } catch (error) {
            request.log.error(error, 'Failed to retrieve user')

            return reply.code(500).send({
                message: 'Unable to retrieve user'
            })
        }
    })

    // --------------------------------------------------
    // LOGOUT
    // Additional Fastify endpoint
    // --------------------------------------------------

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