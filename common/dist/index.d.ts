import z from "zod";
export declare const signin: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type signin_inp = z.infer<typeof signin>;
export declare const signup: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
}, {
    email: string;
    password: string;
    name: string;
}>;
export type signup_inp = z.infer<typeof signup>;
export declare const name: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type signup_name = z.infer<typeof name>;
export declare const email: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type signup_email = z.infer<typeof email>;
export declare const password: z.ZodObject<{
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
}, {
    password: string;
}>;
export type signup_pswd = z.infer<typeof password>;
export declare const red: z.ZodObject<{
    name: z.ZodBoolean;
    email: z.ZodBoolean;
    password: z.ZodBoolean;
    existing_email: z.ZodBoolean;
    retypepswd: z.ZodBoolean;
    onbtn: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    email: boolean;
    password: boolean;
    name: boolean;
    existing_email: boolean;
    retypepswd: boolean;
    onbtn: boolean;
}, {
    email: boolean;
    password: boolean;
    name: boolean;
    existing_email: boolean;
    retypepswd: boolean;
    onbtn: boolean;
}>;
export type red_inp = z.infer<typeof red>;
export declare const retype: z.ZodObject<{
    retype: z.ZodString;
}, "strip", z.ZodTypeAny, {
    retype: string;
}, {
    retype: string;
}>;
export type retype_inp = z.infer<typeof retype>;
export declare const postdata: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    image: z.ZodObject<{
        base64: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        base64?: string | null | undefined;
        name?: string | null | undefined;
    }, {
        base64?: string | null | undefined;
        name?: string | null | undefined;
    }>;
    tags: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    image: {
        base64?: string | null | undefined;
        name?: string | null | undefined;
    };
    tags: string[];
}, {
    title: string;
    content: string;
    image: {
        base64?: string | null | undefined;
        name?: string | null | undefined;
    };
    tags: string[];
}>;
export type pstdata = z.infer<typeof postdata>;
export declare const vaild_data: z.ZodObject<{
    frd_id: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
    txt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    frd_id?: string | undefined;
    id?: string | undefined;
    txt?: string | undefined;
}, {
    frd_id?: string | undefined;
    id?: string | undefined;
    txt?: string | undefined;
}>;
export type valid_data_frn = z.infer<typeof vaild_data>;
