import type { FastifyReply, FastifyRequest } from 'fastify'

export async function requireAuth( request: FastifyRequest, reply: FastifyReply ) {
    try {
        const authorization = request.headers.authorization

        if (authorization && !authorization.startsWith('Bearer ')) {
        request.headers.authorization = `Bearer ${authorization}`
        }

        await request.jwtVerify()
    } catch {
        return reply.code(401).send({
        message: 'Unauthorized'
        })
    }
}