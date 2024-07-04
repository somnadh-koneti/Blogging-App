import z from "zod";

export const signin=z.object({
    email: z.string().trim(),
    password:z.string().trim()})
export type signin_inp=z.infer<typeof signin>


const regexPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*-])[A-Za-z\d!@#$%&*-]{8,}$/;

export const signup=z.object({
    email: z.string().email().trim(),
    name:  z.string().trim().min(2).max(12).toLowerCase(),
    password: z.string().min(8).max(32).regex(regexPattern).trim()
});
export type signup_inp=z.infer<typeof signup>

export const name = z.object({
	name: z.string().trim().min(2).max(12).toLowerCase(),
})
export type signup_name=z.infer<typeof name>


export const email = z.object({
	email: z.string().email().trim(),
})
export type signup_email=z.infer<typeof email>


export const password = z.object({
    password: z.string().min(8).max(32).regex(regexPattern).trim()
});
export type signup_pswd=z.infer<typeof password>

//---------- red values------------------------------------

export const red=z.object({
    name:z.boolean(),
    email:z.boolean(),
    password: z.boolean(),
    existing_email : z.boolean(),
    retypepswd : z.boolean(),
    onbtn: z.boolean()
})
export type red_inp=z.infer<typeof red>


//------------retype----------------------------------------

export const retype=z.object({
    retype:z.string().trim()
})
export type retype_inp=z.infer<typeof retype>


//----------------postdata------------------------------
const base64Regex = /^data:image\/[a-zA-Z]+;base64,[a-zA-Z0-9+/=]+$/;

export const postdata=z.object({
    title:z.string().min(10).max(100).trim(),
    content:z.string().min(20).max(1000).trim(),
    image: z.object({
        base64: z.string().regex(base64Regex).trim().optional().nullable(),
        name: z.string().optional().nullable()}),
    tags: z.array(z.string().min(1).max(15).toLowerCase().trim()).min(1).max(5)
    })
export type pstdata=z.infer<typeof postdata>

// --------------------only for backend vaild_data----------

export const vaild_data=z.object({
    frd_id:z.string().min(1).optional(),
    id:z.string().min(1).optional(),
    txt:z.string().min(1).max(15).optional()
})
export type valid_data_frn=z.infer<typeof vaild_data>

