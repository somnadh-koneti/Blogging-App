import 'dotenv/config'
import { buildApp } from './app'

const app = buildApp()

const start = async () => {
    try {
        await app.listen({ port: 8788, host: '127.0.0.1' })
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

start()