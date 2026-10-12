import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

export async function getUserProfile(userId: string) {
    const data = await prisma.user.findUnique({
        where: {
        id: userId
        },
        select: {
        id: true,
        email: true,
        name: true,
        userImage: true,
        createdAt: true,

        followedBy: {
            select: {
            following: {
                select: {
                id: true,
                name: true,
                userImage: true
                }
            }
            }
        },

        following: {
            select: {
            followedBy: {
                select: {
                id: true,
                name: true,
                userImage: true,
                following: {
                    where: {
                    followedById: userId
                    },
                    select: {
                    followedById: true
                    }
                }
                }
            }
            }
        },

        posts: {
            include: {
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
        }
        }
    })

    if (!data) {
        return null
    }

    return {
        ...data,

        following: data.following.map(value => ({
        ...value.followedBy,
        isFollowingMe: value.followedBy.following.length > 0
        })),

        posts: data.posts.map(post => ({
        ...post,
        tags: post.tags.map(postTag => postTag.tag.name),
        savedBy: post.savedBy.length > 0
        }))
    }
}

export async function verifyCurrentPassword( userId: string, currentPassword: string ) {
    const user = await prisma.user.findUnique({
        where: {
        id: userId
        },
        select: {
        password: true
        }
    })

    if (!user) {
        return false
    }

    return bcrypt.compare(currentPassword, user.password)
}

export async function updateUsername( userId: string, username: string ) {
    const user = await prisma.user.update({
        where: { id: userId },
        data: { name: username },
        select: {
            id: true,
            name: true
        }
    })

    return user
}

export async function updatePassword( userId: string, newPassword: string ) {
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            password: hashedPassword
        }
    })
}

export async function updateProfileImage( userId: string, image: string ) {
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            userImage: image
        },
        select: {
            id: true,
            userImage: true
        }
    })

    return user
}