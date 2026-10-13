import Fastify from 'fastify'
import { prisma } from './lib/prisma'
import { authRoutes } from './routes/auth.routes'
import { registerAuthPlugins } from './plugins/auth'
import { blogRoutes } from './routes/blog.routes'
import { validationRoutes } from './routes/validation.routes'
import fastifyCors from '@fastify/cors'

export function buildApp() {
    const app = Fastify({ logger: true })

    app.register(fastifyCors, {
        origin: [
            'http://localhost:5173',
            'http://127.0.0.1:5173'
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    })

    app.get('/health', async () => {
        return {
        status: 'ok',
        service: 'blogging-api'
        }
    })

    app.get('/health/database', async () => {
        const userCount = await prisma.user.count()

        return {
        status: 'ok',
        database: 'connected',
        userCount
        }
    })

    app.register(registerAuthPlugins)

    app.register(authRoutes, {
        prefix: '/userdetails'
    })

    app.register(blogRoutes, {
        prefix: '/blogdetails'
    })

    app.register(validationRoutes, {
        prefix: '/typeddetails'
    })

    return app
    }