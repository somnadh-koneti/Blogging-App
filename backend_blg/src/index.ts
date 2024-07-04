import { Hono } from 'hono'
import { userRouter} from "./routes/userdetails"
import { blogRouter } from './routes/blogdetails'
import { cors } from 'hono/cors';
import { tydata_signup } from './routes/typed_data_signup';


const app = new Hono<{Bindings:{DATABASE_URL:string; JWT_SECRET:string;}}>()

app.use("/*",cors())

app.route("/userdetails",userRouter);
app.route("/blogdetails",blogRouter);
app.route("/typeddetails",tydata_signup)


export default app
