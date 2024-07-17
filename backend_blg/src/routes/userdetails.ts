import {Hono} from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/utils/jwt/jwt'
import {signup,signin} from "@somnadh/blog"
import bcrypt from 'bcryptjs';





export const userRouter= new Hono<{Bindings:{DATABASE_URL:string; JWT_SECRET:string;}}>();


//----------------signup-------------------------------------------

userRouter.post('/signup', async (c) => {

const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate()) 

const body= await c.req.json();

const {success}=signup.safeParse(body);

if(!success){
    return c.text("Invalid inputs."); 
}

try{
    const hashedPassword = await bcrypt.hash(body.password, 10);

    await prisma.user.create({
    data:{
        name:body.name.toLowerCase(),
        email:body.email.toLowerCase(),
        password:hashedPassword,
        }
    })

    return c.text("Done"); 
    }

catch(e){
    console.log(e)
    return c.text("Error while creating account, Try again.");}
})

//------------------signin-------------------------------
let tokenval="";

userRouter.get('/jwtcheck', async (c) => {
    return c.json({token:tokenval})
})    

userRouter.get('/jwtlogout', async (c) => {
    tokenval=""
    return c.json({})
}) 

userRouter.post('/signin', async (c) => {
const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())

const body= await c.req.json();
const {success}=signin.safeParse(body);
if(!success){ return c.json({message:"Invalid inputs"}); }

try{

    const user = await prisma.user.findUnique({
        where: {email: body.email.toLowerCase()},
    });

    if (!user) {
        return c.json({message: "Invalid credentials"})    }

    const passwordMatch = await bcrypt.compare(body.password, user.password);

    if(!passwordMatch){
        return c.json({message: "Invalid credentials"})
    }
    const jwt= await sign({id:user.id},c.env.JWT_SECRET)
    tokenval=jwt;

    return c.json({
        message: "valid",
        token:jwt})

    }
    catch(e){
        return c.json({message: "Error while Signin, Try again."})
    }
})
