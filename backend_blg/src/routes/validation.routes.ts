import type { FastifyInstance } from 'fastify'
import { name, password, email } from '@somnadh/blog'
import { prisma } from '../lib/prisma'

export async function validationRoutes(app: FastifyInstance) {

    app.post('/name', async (request, reply) => {
        const body = request.body as { name?: unknown } | null

        const result = name.safeParse({
            name: body?.name
        })

        if (!result.success) {
            return reply.code(200).send({
                message: '0',
                value: 'name'
            })
        }

        return reply.code(200).send({
            message: '1',
            value: 'name'
        })
    })

    app.post('/password', async (request, reply) => {
        const body = request.body as {
            password?: unknown
            NewPass?: unknown
        } | null

        const passwordValue = body?.password || body?.NewPass

        const result = password.safeParse({
            password: passwordValue
        })

        if (!result.success) {
            return reply.code(200).send({
                message: '0',
                value: 'password'
            })
        }

        return reply.code(200).send({
            message: '1',
            value: 'password'
        })
    })

    app.post('/email', async (request, reply) => {
        const body = request.body as {
            email?: unknown
        } | null

        const result = email.safeParse({
            email: body?.email
        })

        if (!result.success) {
            return reply.code(200).send({
                message: '0',
                value: 'email'
            })
        }

        try {
            const normalizedEmail = result.data.email.toLowerCase()

            const existingUser = await prisma.user.findUnique({
                where: {
                    email: normalizedEmail
                },
                select: {
                    id: true
                }
            })

            if (existingUser) {
                return reply.code(200).send({
                    message: '2',
                    value: 'email'
                })
            }

            return reply.code(200).send({
                message: '1',
                value: 'email'
            })
        } catch (error) {
            request.log.error(error, 'Email validation failed')

            return reply.code(500).send({
                message: 'Unable to validate email'
            })
        }
    })

}