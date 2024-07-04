import {Hono} from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {email, name, password } from "@somnadh/blog"


export const tydata_signup= new Hono<{Bindings:{DATABASE_URL:string; JWT_SECRET:string;}}>();


tydata_signup.post("/name", async(c)=>{

    const data= await c.req.json();
    const val={name:data.name};
    const { success } = name.safeParse(val);
    if (!success) {
        return c.json({
            message: "0",
            value: 'name'
        })
    }
    return c.json({
        message: "1",
        value: 'name'
    })

})

tydata_signup.post("/password", async (c) => {

    const data =await c.req.json();
    const val={password: data.password || data.NewPass};
    const { success } = password.safeParse(val)
    if (!success) {
        return c.json({
            message: "0",
            value: 'password'
        })
    }
    c.status(200);
    return c.json({
        message: "1",
        value: 'password'
    })

})

tydata_signup.post("/email", async (c) => {

    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate()) 
    const data= await c.req.json();

    const val = {email: data.email}
    const { success } = email.safeParse(val);
    if (!success) {
        return c.json({
            message: "0",
            value: 'email'
        })
    }

    const existing_user= await prisma.user.findFirst({
        where:{email:data.email}})


    if (existing_user) {
        return c.json({
            message: "2",
            value: 'email'
        })
    }
    c.status(200);
    return c.json({
        message: "1",
        value: 'email'
    })
})