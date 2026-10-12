import Fastify from 'fastify'
import { prisma } from './lib/prisma'
import { authRoutes } from './routes/auth.routes'
import { registerAuthPlugins } from './plugins/auth'
import { blogRoutes } from './routes/blog.routes'

export function buildApp() {
    const app = Fastify({
        logger: true
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

    return app
    }