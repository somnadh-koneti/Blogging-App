import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

export async function savePost( userId: string, postId: string) {

    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true }
    })

    if (!post) {
        return 'POST_NOT_FOUND'
    }

    try {
        await prisma.savedPost.create({
        data: {
            userId,
            postId
        }
        })

        return 'SAVED'
    } catch (error) {
        if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
        ) {
        return 'ALREADY_SAVED'
        }

        throw error
    }
    }

export async function unsavePost(
    userId: string,
    postId: string
    ) {
    const result = await prisma.savedPost.deleteMany({
        where: {
        userId,
        postId
        }
    })

    if (result.count === 0) {
        return 'NOT_SAVED'
    }

    return 'UNSAVED'
}

export async function getSavedPosts(userId: string) {
    const savedPosts = await prisma.savedPost.findMany({
        where: { userId },
        include: {
        post: {
            include: {
            author: {
                select: {
                name: true,
                userImage: true
                }
            },
            tags: {
                include: {
                tag: true
                }
            }
            }
        }
        },
        orderBy: {
        post: {
            createdAt: 'desc'
        }
        }
    })

    return savedPosts.map(saved => ({
        ...saved.post,
        tags: saved.post.tags.map(postTag => postTag.tag.name),
        savedBy: true
    }))
}