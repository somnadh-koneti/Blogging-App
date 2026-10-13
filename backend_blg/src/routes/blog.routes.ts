import type { FastifyInstance } from 'fastify'
import { requireAuth } from '../middleware/auth.middleware'
import { postdata } from '@somnadh/blog'
import { Prisma } from '@prisma/client'
import { getAllBlogs, getBlogById, getBlogsByUserId, createBlog, deleteBlog, searchBlogsByTags } from '../services/blog.service'
import { followUser, unfollowUser, getFollowingPosts } from '../services/follow.service'
import { savePost, unsavePost, getSavedPosts } from '../services/saved-post.service'
import { getHomePageDetails } from '../services/auth.service'
import { getUserProfile, updateUsername, updatePassword, updateProfileImage, verifyCurrentPassword } from '../services/profile.service'

export async function blogRoutes(app: FastifyInstance) {

    app.get('/home_page_details', { preHandler: requireAuth }, async (request, reply) => {
        try {
            const user = await getHomePageDetails(request.user.id)

            if (!user) {
            return reply.code(404).send({ message: 'User not found' })
            }

            return reply.code(200).send(user)
        } catch (error) {
            request.log.error(error, 'Failed to retrieve home page details')

            return reply.code(500).send({ message: 'Unable to retrieve home page details' })
        }
    })

    app.get('/blog_details', { preHandler: requireAuth }, async (request, reply) => {
        try {
            const profile = await getUserProfile(request.user.id)

            if (!profile) {
            return reply.code(404).send({
                message: 'User not found'
            })
            }

            return reply.code(200).send(profile)
        } catch (error) {
            request.log.error(error, 'Failed to retrieve user profile')

            return reply.code(500).send({
            message: 'Unable to retrieve user profile'
            })
        }
    })

    app.get('/blog', { preHandler: requireAuth }, async (request, reply) => {
        try {
            const blogs = await getAllBlogs(request.user.id)

            return reply.code(200).send(blogs)
        } catch (error) {
        request.log.error(error, 'Failed to fetch blogs')

        return reply.code(500).send({
            message: 'Unable to fetch blogs'
        })
        }
    })

    app.get<{ Params: { id: string } }>('/blog/:id', { preHandler: requireAuth }, async (request, reply) => {
    const { id } = request.params

    // Validate UUID format before querying PostgreSQL.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    if (!uuidRegex.test(id)) {
        return reply.code(400).send({
        message: 'Invalid blog ID'
        })
    }

    try {
        const blog = await getBlogById(id, request.user.id)

        if (!blog) {
        return reply.code(404).send({ message: 'Blog not found' })
        }

        return reply.code(200).send(blog)
    } catch (error) {
        request.log.error(error, 'Failed to fetch blog')

        return reply.code(500).send({
        message: 'Unable to fetch blog'
        })
    }
    })

    app.get<{ Params: { id: string } }>( '/specific_userId_blog/:id', { preHandler: requireAuth }, async (request, reply) => {

        const { id } = request.params

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

        if (!uuidRegex.test(id)) {
        return reply.code(400).send({
            message: 'Invalid user ID'
        })
        }

        try {
        const result = await getBlogsByUserId(
            id,
            request.user.id
        )

        return reply.code(200).send(result)
        } catch (error) {
        request.log.error(error, 'Failed to fetch user blogs')

        return reply.code(500).send({
            message: 'Unable to fetch user blogs'
        })
        }
    }
    )

    app.post('/blog_create', { preHandler: requireAuth }, async (request, reply) => {
    
    const result = postdata.safeParse(request.body)

    if (!result.success) {
        return reply.code(400).send({
        message: 'Invalid blog details',
        errors: result.error.flatten()
        })
    }

    const data = result.data

    // Prevent duplicate tags within the same post.
    if (new Set(data.tags).size !== data.tags.length) {
        return reply.code(400).send({
        message: 'Duplicate tags are not allowed'
        })
    }

    try {
        const blogId = await createBlog(request.user.id, data)

        return reply.code(201).send({
        msg: blogId
        })
    } catch (error) {
        request.log.error(error, 'Failed to create blog')

        return reply.code(500).send({
        message: 'Unable to create blog'
        })
    }
    })

    app.put('/blog_delete', { preHandler: requireAuth }, async (request, reply) => {
    
    const body = request.body as { id?: unknown }

    const blogId = body?.id

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    if (typeof blogId !== 'string' || !uuidRegex.test(blogId)) {
        return reply.code(400).send({
        message: 'Invalid blog ID'
        })
    }

    try {
        const result = await deleteBlog(blogId, request.user.id)

        if (result === 'NOT_FOUND') {
        return reply.code(404).send({
            message: 'Blog not found'
        })
        }

        if (result === 'FORBIDDEN') {
        return reply.code(403).send({
            message: 'You cannot delete another user’s blog'
        })
        }

        return reply.code(200).send({
        val: true
        })
    } catch (error) {
        if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2034'
        ) {
        return reply.code(409).send({
            message: 'A database conflict occurred. Please retry.'
        })
        }

        request.log.error(error, 'Failed to delete blog')

        return reply.code(500).send({
        message: 'Unable to delete blog'
        })
    }
    })

    app.post('/search_by_tags', { preHandler: requireAuth }, async (request, reply) => {
    
    const body = request.body as { txt?: unknown }

    if (
        typeof body?.txt !== 'string' ||
        body.txt.trim().length < 1 ||
        body.txt.trim().length > 15
    ) {
        return reply.code(400).send({
        message: 'Invalid search text'
        })
    }

    const searchText = body.txt.trim().toLowerCase()

    try {
        const blogs = await searchBlogsByTags(
        searchText,
        request.user.id
        )

        return reply.code(200).send(blogs)
    } catch (error) {
        request.log.error(error, 'Failed to search blogs')

        return reply.code(500).send({
        message: 'Unable to search blogs'
        })
    }
    })

    app.post('/connect_friends', { preHandler: requireAuth }, async (request, reply) => {
    
    const body = request.body as { id?: unknown }

    const targetUserId = body?.id

    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    if (
        typeof targetUserId !== 'string' ||
        !uuidRegex.test(targetUserId)
    ) {
        return reply.code(400).send({
        message: 'Invalid user ID'
        })
    }

    try {
        const result = await followUser(
        request.user.id,
        targetUserId
        )

        if (result === 'SELF_FOLLOW') {
        return reply.code(400).send({
            message: 'You cannot follow yourself'
        })
        }

        if (result === 'USER_NOT_FOUND') {
        return reply.code(404).send({
            message: 'User not found'
        })
        }

        if (result === 'ALREADY_FOLLOWING') {
        return reply.code(409).send({
            message: 'You are already following this user'
        })
        }

        return reply.code(201).send({
        val: true
        })
    } catch (error) {
        request.log.error(error, 'Failed to follow user')

        return reply.code(500).send({
        message: 'Unable to follow user'
        })
    }
    })

    app.post('/unfollow_friend', { preHandler: requireAuth }, async (request, reply) => {
    const body = request.body as { id?: unknown }

    const targetUserId = body?.id

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    if (
        typeof targetUserId !== 'string' ||
        !uuidRegex.test(targetUserId)
    ) {
        return reply.code(400).send({
        message: 'Invalid user ID'
        })
    }

    try {
        const result = await unfollowUser(
        request.user.id,
        targetUserId
        )

        if (result === 'SELF_UNFOLLOW') {
        return reply.code(400).send({
            message: 'You cannot unfollow yourself'
        })
        }

        if (result === 'NOT_FOLLOWING') {
        return reply.code(404).send({
            message: 'You are not following this user'
        })
        }

        return reply.code(200).send({
        val: true
        })
    } catch (error) {
        request.log.error(error, 'Failed to unfollow user')

        return reply.code(500).send({
        message: 'Unable to unfollow user'
        })
    }
    })

    app.post('/Save_Post', { preHandler: requireAuth }, async (request, reply) => {
        const body = request.body as { Post_id?: unknown } | null
        const postId = body?.Post_id

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

        if ( typeof postId !== 'string' || !uuidRegex.test(postId) ) {
            return reply.code(400).send({ message: 'Invalid post ID' })
        }

        try {
            const result = await savePost( request.user.id, postId )

            if (result === 'POST_NOT_FOUND') {
                return reply.code(404).send({ message: 'Post not found' })
            }

            if (result === 'ALREADY_SAVED') {
                return reply.code(409).send({ message: 'Post is already saved' })
            }

            return reply.code(201).send({ val: true })
        } catch (error) {
            request.log.error(error, 'Failed to save post')
            return reply.code(500).send({ message: 'Unable to save post' })
        }
    })

    app.post('/unSave_Post', { preHandler: requireAuth }, async (request, reply) => {
        const body = request.body as { Post_id?: unknown } | null
        const postId = body?.Post_id

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

        if ( typeof postId !== 'string' || !uuidRegex.test(postId) ) {
            return reply.code(400).send({ message: 'Invalid post ID' })
        }

        try {
            const result = await unsavePost( request.user.id, postId )

            if (result === 'NOT_SAVED') {
                return reply.code(404).send({ message: 'Post is not saved' })
            }

            return reply.code(200).send({ val: true })
        } catch (error) {
            request.log.error(error, 'Failed to unsave post')

            return reply.code(500).send({ message: 'Unable to unsave post' })
        }
    })

    app.get('/savedPosts', { preHandler: requireAuth }, async (request, reply) => {
        try {
            const savedPosts = await getSavedPosts(request.user.id)

            return reply.code(200).send(savedPosts)
        } catch (error) {
            request.log.error(error, 'Failed to retrieve saved posts')

            return reply.code(500).send({
            message: 'Unable to retrieve saved posts'
            })
        }
    })

    app.get('/following', { preHandler: requireAuth }, async (request, reply) => {
        try {
            const posts = await getFollowingPosts(request.user.id)

            return reply.code(200).send(posts)
        } catch (error) {
            request.log.error(error, 'Failed to retrieve following posts')

            return reply.code(500).send({
            message: 'Unable to retrieve following posts'
            })
        }
    })

    app.post('/Check_password', { preHandler: requireAuth }, async (request, reply) => {
        const body = request.body as { CurrPass?: unknown } | null

        if (typeof body?.CurrPass !== 'string' || !body.CurrPass) {
            return reply.code(400).send({
                message: 'Current password is required'
            })
        }

        try {
            const isValid = await verifyCurrentPassword(
                request.user.id,
                body.CurrPass
            )

            return reply.code(200).send({
                msg: isValid ? '1' : '0'
            })
        } catch (error) {
            request.log.error(error, 'Failed to verify current password')

            return reply.code(500).send({
                message: 'Unable to verify current password'
            })
        }
    })

    // --------------------------------------------------
    // UPDATE PASSWORD
    // Original Hono endpoint: PUT /blogdetails/upt_password
    // --------------------------------------------------

    app.put('/upt_password', { preHandler: requireAuth }, async (request, reply) => {
        const body = request.body as { password?: unknown } | null

        if (typeof body?.password !== 'string' || body.password.length === 0) {
            return reply.code(400).send({
                message: 'Password is required'
            })
        }

        try {
            await updatePassword(request.user.id, body.password)

            return reply.code(200).send({
                msg: 'Password Updated'
            })
        } catch (error) {
            request.log.error(error, 'Failed to update password')

            return reply.code(500).send({
                message: 'Unable to update password'
            })
        }
    })

    app.put('/upt_username', { preHandler: requireAuth }, async (request, reply) => {
    
        const body = request.body as { username?: unknown }

        if (typeof body?.username !== 'string') {
            return reply.code(400).send({
            message: 'Username is required'
            })
        }

        const username = body.username.trim()

        if (username.length < 2 || username.length > 100) {
            return reply.code(400).send({
            message: 'Username must be between 2 and 100 characters'
            })
        }

        try {
            await updateUsername(request.user.id, username)

            return reply.code(200).send({
            msg: 'Username Updated'
            })
        } catch (error) {
            request.log.error(error, 'Failed to update username')

            return reply.code(500).send({
            message: 'Unable to update username'
            })
        }
    })

    
    // --------------------------------------------------
    // UPDATE PROFILE IMAGE
    // Original Hono endpoint: PUT /blogdetails/upt_image
    // --------------------------------------------------

    app.put('/upt_image', { preHandler: requireAuth }, async (request, reply) => {
        const body = request.body as { image?: unknown } | null

        if (typeof body?.image !== 'string') {
            return reply.code(400).send({
                message: 'Image must be a string'
            })
        }

        try {
            await updateProfileImage(request.user.id, body.image)

            return reply.code(200).send({
                msg: 'Image Updated'
            })
        } catch (error) {
            request.log.error(error, 'Failed to update profile image')

            return reply.code(500).send({
                message: 'Unable to update profile image'
            })
        }
    })
}