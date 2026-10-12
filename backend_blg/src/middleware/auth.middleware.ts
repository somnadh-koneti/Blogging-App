import type { FastifyReply, FastifyRequest } from 'fastify'

export async function requireAuth(
    request: FastifyRequest,
    reply: FastifyReply
    ) {
    try {
        await request.jwtVerify({
        onlyCookie: true
        })
    } catch {
        return reply.code(401).send({
        message: 'Unauthorized'
        })
    }
}