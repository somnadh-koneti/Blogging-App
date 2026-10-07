import 'dotenv/config'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { userRouter } from './routes/userdetails'
import { blogRouter } from './routes/blogdetails'
import { cors } from 'hono/cors'
import { tydata_signup } from './routes/typed_data_signup'

const app = new Hono()

app.use('/*', cors())

app.route('/userdetails', userRouter)
app.route('/blogdetails', blogRouter)
app.route('/typeddetails', tydata_signup)

const port = 8787

console.log(`Backend running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})