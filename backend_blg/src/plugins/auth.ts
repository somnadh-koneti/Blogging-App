import fp from 'fastify-plugin'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'

export const registerAuthPlugins = fp(
    async (app) => {
        const jwtSecret = process.env.JWT_SECRET

        if (!jwtSecret) {
        throw new Error('JWT_SECRET is missing from environment variables')
        }

        await app.register(fastifyCookie)

        await app.register(fastifyJwt, {
        secret: jwtSecret,
        cookie: {
            cookieName: 'access_token',
            signed: false
        },
        sign: {
            expiresIn: '1h'
        }
        })
    },
    {
        name: 'auth-plugins'
    }
)