import {Hono} from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from "hono/jwt";
import { postdata,vaild_data} from "@somnadh/blog";
import bcrypt from 'bcryptjs';



export const blogRouter= new Hono<{Bindings:{DATABASE_URL:string;
                                            JWT_SECRET:string;},
                                    Variables:{userid:string}}>();


//--------------------middleware-------------------------------

blogRouter.use("/*", async (c,next)=>{

    try{
        const auth=c.req.header("authorization") || "";
        const user= await verify(auth,c.env.JWT_SECRET)
        if(user){
            c.set("userid",user.id)
            await next()
        }
        else{
            c.json(403)
            return c.json({msg:"invalid token."})
        }
    }
    catch(e){
        return c.json({msg:"You are logged out or Invalid token."});
    }
    
})
//------------------------home_page_details------------------

blogRouter.get('/home_page_details', async(c) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
    const id= c.get("userid")
    
    const {success}=vaild_data.safeParse({id:id})
    if(!success){return c.json({msg:"Error, retry by login.",val:id})}
    
    try{
        const data = await prisma.user.findFirst({
            where:{id:id},
            select:{ id: true,name: true, userImage: true}
        });    
        return c.json(data);
    }
    catch(e){
        c.status(411);
        return c.json({msg:"Error while fetching post."})
    }
    })

//-----------------------get_user_details---------------------

blogRouter.get('/blog_details', async(c) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
    const id= c.get("userid")
    
    const {success}=vaild_data.safeParse({id:id})
    if(!success){return c.json({msg:"Error, retry by login.",val:id})}
    
    try{
        const data = await prisma.user.findFirst({
            where:{id:id},
            select:{ id: true, email: true, name: true, userImage: true,createdAt:true, 
                    followedBy: {select: {following: {select: {name: true,userImage: true,id:true,}}}},
                    following: {select: {followedBy: {select: {name: true,userImage: true,id:true,following: {
                        where: { followedById: id },
                        select: { followedById: true }
                        }}}}},
                    posts: {include:{tags: {include: {tag: true}},savedBy: {where: {userId: id},select: {id: true}}}}
                }
        });

        const sortedPosts = data?.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        const user_data = {...data,following:data?.following.map(val=>({...val.followedBy,isFollowingMe:val.followedBy.following.length>0})) ,posts:sortedPosts?.map(val =>({...val,tags: val.tags.map(postTag => postTag.tag.name),savedBy: val.savedBy.length > 0}))};
        
        return c.json(user_data);
    }
    catch(e){
        c.status(411);
        return c.json({msg:"Error while fetching post."})
    }
    })


//----------------------all_blogs-----------------------add paginaton(initial 10 blogs , if requested 10 more pagination means)

blogRouter.get('/blog', async(c) => {
const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())

const id=c.get("userid")

try{
    const blogs = await prisma.post.findMany({
        include: {tags: {include: {tag: true}},author: {select: {name: true,userImage: true}},savedBy: {where: {userId: id},select: {id: true}}},
        orderBy: {createdAt: 'desc'} 
    });

    const blog_data = blogs.map(blog => ({...blog, tags: blog.tags.map(postTag => postTag.tag.name),savedBy: blog.savedBy.length > 0}));

    return c.json(blog_data);
}
catch(e){
    c.status(411);
    return c.json({msg:"Error while fetching post."})
}
})

//-----------------blog_id---------------------------

blogRouter.get('/blog/:id', async (c) => { // /blog/:id -> body=c.req.param("id")  where:{id:body}
    
const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
const body= c.req.param("id")
const user_id=c.get("userid")

const {success}=vaild_data.safeParse({id:body})
if(!success){return c.json("Error, retry.")}

try{
    const id= await prisma.post.findFirst({
        where:{id:body},
        include: {tags: {include: {tag: true}},author: {select: {name: true,userImage: true}},savedBy: {where: {userId: user_id},select: {id: true}}}
    })
    if (!id) {return c.json({ error: 'Post not found' });}
    const blog_id = {...id, tags: id.tags.map(postTag => postTag.tag.name),savedBy: id.savedBy.length > 0};

    return c.json(blog_id);
}
catch(e){
    c.status(411);
    return c.json({msg:"Error while fetching post."})
}
})

//---------------------get specific_userId_blog--------------

blogRouter.get('/specific_userId_blog/:id', async (c) => {
    
const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
const body= c.req.param("id")
const id=c.get("userid")

const {success}=vaild_data.safeParse({id:body})
if(!success){return c.json("Error, retry.")}
const val=vaild_data.safeParse({id:id})
if(!val.success){return c.json("Error, retry.")}

try{
    const data= await prisma.post.findMany({
        where:{authorId:body},
        include: {tags: {include: {tag: true}},author: {select: {name: true,userImage: true}},savedBy: {where: {userId: id},select: {id: true}}},
        orderBy: {createdAt: 'desc'}
    })
    if (!data) {return c.json({ error: 'Post not found' });}
    const blog_data = data.map(blog => ({...blog, tags: blog.tags.map(postTag => postTag.tag.name),savedBy: blog.savedBy.length > 0}));

    const isFollowing = await prisma.follows.findFirst({
        where: {followingId: body,followedById: id}
        });

    const isFriend = !!isFollowing; 

    const result = {isFriend,post_data: blog_data};

    return c.json(result);
}
catch(e){
    c.status(411);
    return c.json({msg:"Error while fetching post."})
}
})

//------------------blog_create---------------------

blogRouter.post('/blog_create', async(c) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())

    const body= await c.req.json();
    const { success } = postdata.safeParse(body);
    if (!success) {return c.json({value: 'invalid data,retry to submit.'})}

    const id=c.get("userid")
    try{
        const tagRecords = await Promise.all(body.tags.map(async (tagName:string) => {
            return prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
            });}));

        const blog=await prisma.post.create({
            data: {
                title:body.title,
                content:body.content,
                image:body.image.base64,
                authorId:id,
                tags: {create: tagRecords.map(tag => ({tag: {connect: { id: tag.id }}}))}
            },
            include: {tags: true}
            })

    return c.json({msg:blog.id})

    }
    catch(e){
        console.log((e as Error).message)
        return c.json({msg:false,})
    }
})

//----------------------blog_delete-----------------------------

blogRouter.put('/blog_delete', async (c) => {
const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
const body= await c.req.json();


const {success} = vaild_data.safeParse({id:body.id})
if(!success){return c.json({value: 'Invalid id,retry by login.'})}

try {
    await prisma.postTag.deleteMany({where: {postId: body.id}});
    await prisma.savedPost.deleteMany({where: {postId: body.id}});

    await prisma.post.delete({where: {id: body.id}});

    return c.json({ val: true });
    } 
    catch (e) {
        return c.json({val:false});}

})

//-------------------search_by_tags---------------------------

blogRouter.post('/search_by_tags', async (c) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
    const body=await c.req.json()
    const id=c.get("userid")
    
    const {success}=vaild_data.safeParse({txt:body.txt})
    if(!success){return c.json("Error, retry by login.")}

    const generateSubstrings = (input: string, minLen = 4, maxLen = 10) => {
        const substrings = new Set();
        for (let len = minLen; len <= maxLen; len++) {
            for (let i = 0; i <= input.length - len; i++) {substrings.add(input.substring(i, i + len));}}
        return Array.from(substrings);
        };
    
    const substrings = generateSubstrings(body.txt);
    
    try{
        const exactMatchPosts = await prisma.post.findMany({
            where: {tags: {some: {tag: {name: body.txt}}}},
            include: {tags: {include: {tag: true}},author: {select: {name: true,userImage: true}},savedBy: {where: {userId: id},select: {id: true}}}
        });

        const exactMatchPostIds = exactMatchPosts.map(post => post.id);

        const partialMatchConditions = substrings.map(substring => ({tags: {some: {tag: { name: { contains: substring as string}}}}}));

        const partialMatchPosts = await prisma.post.findMany({
            where: {id: { notIn: exactMatchPostIds },
            OR: partialMatchConditions},
            include: {tags: { include: { tag: true } },author: { select: { name: true, userImage: true } },savedBy: { where: { userId: id }, select: { id: true } }}});
        
        const blogs = [...exactMatchPosts, ...partialMatchPosts];

        if (!blogs) {return c.json({ error: 'No posts were found.' });}

        const blg_data = blogs.map(post => ({...post,tags: post.tags.map(postTag => postTag.tag.name),savedBy: post.savedBy.length > 0}));

        return c.json(blg_data);
    }
    catch(e){
        c.status(411);
        return c.json({msg:"Error while fetching post."})
    } 
})

//---------------------------following_post--------------------

blogRouter.get('/following', async (c) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
    const id= c.get("userid")
    
    const {success}=vaild_data.safeParse({id:id})
    if(!success){return c.json({msg:"Error, retry by login"})}
    
    try {
        const userdata = await prisma.user.findFirst({
            where: { id: id },
            select: {followedBy: {select: {followedById: true,followingId:true}}}
        });

        if (!userdata) {return c.json([])}
    
        const followingUserIds = userdata.followedBy.map(follow => follow.followingId);
    
        const posts = await prisma.post.findMany({
            where: {authorId: {in: followingUserIds}},
            orderBy: {createdAt: 'desc'},
            include: {author: true, tags: {include: {tag: true}},savedBy: {where: {userId: id},select: {id: true}}}
        });
    
        const transformedPosts = posts.map(post => ({...post,tags: post.tags.map(postTag => postTag.tag.name),savedBy: post.savedBy.length > 0}));

    
        return c.json(transformedPosts);

    } 
    catch (error) {return c.json(error)}
});

//---------------------connect_friends----------------------------------

blogRouter.post('/connect_friends', async (c) => {

    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
    const id= c.get("userid")
    const body= await c.req.json();

    
    const {success}=vaild_data.safeParse({id:id,frd_id:body.id})
    if(!success){return c.json({msg:"Error, retry by login"})}
    
    try {
        const existingFollow = await prisma.follows.findFirst({
            where: {followedById:id,followingId:body.id}
            });
    
        if (existingFollow) {
            throw new Error('You are already following this user.');
        }

        await prisma.follows.create({data: {followedById:id,followingId:body.id}});

        return c.json({val:true}); 

    } 
    catch (error) {return c.json(error); }
});

//-------------------------unfollow the user----------------------------

blogRouter.post('/unfollow_friend', async (c) => {

    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
    const id= c.get("userid")
    const body= await c.req.json();

    
    const {success}=vaild_data.safeParse({id:id,frd_id:body.id})
    if(!success){return c.json({msg:"Error, retry by login"})}
    
    try {
        await prisma.follows.delete({where:{followingId_followedById:  {followedById:id,followingId:body.id}}});

        return c.json({val:true}); 

    } 
    catch (error) {return c.json(error)}
});

//-------------------Save_Post--------------------------------

blogRouter.post('/Save_Post', async (c) => {

    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
    const id= c.get("userid")
    const body= await c.req.json();

    const {success}=vaild_data.safeParse({id:body.Post_id})
    if(!success){return c.json({msg:"Error, retry by login"})}
    
    try {
        await prisma.savedPost.create({data: {userId:id,postId:body.Post_id}});

        return c.json({val:true}); 

    } 
    catch (error) {return c.json(error)}
});

//---------------------unSave_Post--------------------

blogRouter.post('/unSave_Post', async (c) => {

    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
    const id= c.get("userid")
    const body= await c.req.json();
    
    const {success}=vaild_data.safeParse({id:body.Post_id})
    if(!success){return c.json({msg:"Error, retry by login"})}
    
    try {
        await prisma.savedPost.delete({where:{userId_postId: {userId:id,postId:body.Post_id}}});

        return c.json({val:true}); 

    } 
    catch (error) {return c.json(error)}
});

//--------------saved_posts----------------

blogRouter.get('/savedPosts', async (c) => {

    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
    const id= c.get("userid")
    
    const {success}=vaild_data.safeParse({id:id})
    if(!success){return c.json({msg:"Error, retry by login"})}
    
    try {
        const data=await prisma.savedPost.findMany({where: {userId:id},orderBy: { createdAt: 'desc' }});

        if(!data){return c.json([])}    

        const saved_data = data.map(val => val.postId);
    
        const posts = await prisma.post.findMany({
            where: {id: {in: saved_data}},
            include: {author: true, tags: {include: {tag: true}},savedBy: {where: {userId: id},select: {id: true}}}
        });
    
        //const transformedPosts = posts.map(post => ({...post,tags: post.tags.map(postTag => postTag.tag.name),savedBy: post.savedBy.length > 0}));

        const transformedPosts = saved_data.map(postId => {
            const post = posts.find(p => p.id === postId);
            if (post) {return {...post,tags: post.tags.map(postTag => postTag.tag.name),savedBy: post.savedBy.length > 0};}
            return null;
            }).filter(post => post !== null); 

        return c.json(transformedPosts); 

    } 
    catch (error) {return c.json(error)}
});


//----------------------------------------------------------------------------------------------------------------------------------


//--------------------check the user password----------------

blogRouter.post("/Check_password", async (c) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
    const id= c.get("userid")

    const data =await c.req.json();
    const user = await prisma.user.findFirst({
        where: {id: id},
    });

    if(user){
        const passwordMatch = await bcrypt.compare(data.CurrPass, user.password);

        if (!passwordMatch) {
            return c.json({msg: "0"})
        }
        c.status(200);
        return c.json({msg: "1"})
    }

})

//----------------update username---------------------------------

blogRouter.put("/upt_username", async (c) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
    const id= c.get("userid")

    const data =await c.req.json();
    try {
        await prisma.user.update({
            where: { id: id },
            data: { name: data.username },
        });
        c.status(200);
        return c.json({msg: "Username Updated"})
    } 
    catch (error) 
    {
    return c.json({msg: "Error,Retry."})
    } 
})

//---------------------update password-------------------

blogRouter.put("/upt_password", async (c) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
    const id= c.get("userid")

    const data =await c.req.json();
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        await prisma.user.update({
            where: { id: id },
            data: { password: hashedPassword },
        });
        c.status(200);
        return c.json({msg: "Password Updated"})
    } 
    catch (error) 
    {
        return c.json({msg: "Error,Retry."})
    } 
})

//-------------update image-------------------

blogRouter.put("/upt_image", async (c) => {
    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL,}).$extends(withAccelerate())
    const id= c.get("userid")

    const data =await c.req.json();
    try {
        await prisma.user.update({
            where: { id: id },
            data: { userImage: data.image },
        });
        c.status(200);
        return c.json({msg: "Image Updated"})
    } 
    catch (error) 
    {
    return c.json({msg: "Error,Retry."})
    } 
})