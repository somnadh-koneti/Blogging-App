import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

export async function followUser( currentUserId: string, targetUserId: string ) {

    if (currentUserId === targetUserId) {
        return 'SELF_FOLLOW'
    }

    const targetUser = await prisma.user.findUnique({
        where: {
        id: targetUserId
        },
        select: {
        id: true
        }
    })

    if (!targetUser) {
        return 'USER_NOT_FOUND'
    }

    try {
        await prisma.follows.create({
        data: {
            followedById: currentUserId,
            followingId: targetUserId
        }
        })

        return 'FOLLOWED'
    } catch (error) {
        if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
        ) {
        return 'ALREADY_FOLLOWING'
        }

        throw error
    }
}

export async function unfollowUser( currentUserId: string, targetUserId: string ) {

    if (currentUserId === targetUserId) {
        return 'SELF_UNFOLLOW'
    }

    const result = await prisma.follows.deleteMany({
        where: {
        followedById: currentUserId,
        followingId: targetUserId
        }
    })

    if (result.count === 0) {
        return 'NOT_FOLLOWING'
    }

    return 'UNFOLLOWED'
}

export async function getFollowingPosts(userId: string) {
    const posts = await prisma.post.findMany({
        where: {
            authorId: {
                in: (
                await prisma.follows.findMany({
                    where: {
                    followedById: userId
                    },
                    select: {
                    followingId: true
                    }
                })
                ).map(follow => follow.followingId)
            }
        },
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
        },
        savedBy: {
            where: {
            userId
            },
            select: {
            id: true
            }
        }
        },
        orderBy: {
        createdAt: 'desc'
        }
    })

    return posts.map(post => ({
        ...post,
        tags: post.tags.map(postTag => postTag.tag.name),
        savedBy: post.savedBy.length > 0
    }))
}