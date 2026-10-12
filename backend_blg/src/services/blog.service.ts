import { prisma } from '../lib/prisma'
import type { pstdata } from '@somnadh/blog'
import { Prisma } from '@prisma/client'

export async function getAllBlogs(userId: string) {

    const blogs = await prisma.post.findMany({
        include: {
        tags: {
            include: {
            tag: true
            }
        },
        author: {
            select: {
            name: true,
            userImage: true
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

    return blogs.map(blog => ({
        ...blog,
        tags: blog.tags.map(postTag => postTag.tag.name),
        savedBy: blog.savedBy.length > 0
    }))
}

export async function getBlogById( blogId: string, userId: string ) {

    const blog = await prisma.post.findUnique({
        where: {
        id: blogId
        },
        include: {
        tags: {
            include: {
            tag: true
            }
        },
        author: {
            select: {
            name: true,
            userImage: true
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
        }
    })

    if (!blog) {
        return null
    }

    return {
        ...blog,
        tags: blog.tags.map(postTag => postTag.tag.name),
        savedBy: blog.savedBy.length > 0
    }
}

export async function getBlogsByUserId( authorId: string, currentUserId: string ) {

    const posts = await prisma.post.findMany({
        where: { authorId },
        include: {
        tags: { include: { tag: true } },
        author: { select: { name: true, userImage: true } },
        savedBy: { where: { userId: currentUserId }, select: { id: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    const following = await prisma.follows.findFirst({
        where: {
        followedById: currentUserId,
        followingId: authorId
        }
    })

    const blogData = posts.map(post => ({
        ...post,
        tags: post.tags.map(postTag => postTag.tag.name),
        savedBy: post.savedBy.length > 0
    }))

    return {
        isFriend: !!following,
        post_data: blogData
    }
}

export async function createBlog(
    userId: string,
    data: pstdata
    ) {
    return prisma.$transaction(async (tx) => {
        const tagRecords = await Promise.all(
        data.tags.map(tagName =>
            tx.tag.upsert({
            where: {
                name: tagName
            },
            update: {},
            create: {
                name: tagName
            }
            })
        )
        )

        const blog = await tx.post.create({
        data: {
            title: data.title,
            content: data.content,
            image: data.image.base64 ?? null,
            authorId: userId,
            tags: {
            create: tagRecords.map(tag => ({
                tag: {
                connect: {
                    id: tag.id
                }
                }
            }))
            }
        }
        })

        return blog.id
    })
}

export async function deleteBlog( blogId: string, userId: string ) {
    
    return prisma.$transaction(async (tx) => {
        const blog = await tx.post.findUnique({
        where: {
            id: blogId
        },
        select: {
            authorId: true
        }
        })

        if (!blog) {
        return 'NOT_FOUND'
        }

        if (blog.authorId !== userId) {
        return 'FORBIDDEN'
        }

        await tx.postTag.deleteMany({
        where: {
            postId: blogId
        }
        })

        await tx.savedPost.deleteMany({
        where: {
            postId: blogId
        }
        })

        await tx.post.delete({
        where: {
            id: blogId
        }
        })

        return 'DELETED'
    }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    })
}

export async function searchBlogsByTags( searchText: string, userId: string) {

    const generateSubstrings = ( input: string, minLen = 4, maxLen = 10 ) => {
        const substrings = new Set<string>()

        for (let len = minLen; len <= maxLen; len++) {
            for (let i = 0; i <= input.length - len; i++) {
                substrings.add(input.substring(i, i + len))
            }
        }

        return Array.from(substrings)
    }

    const substrings = generateSubstrings(searchText)

    const include = {
        tags: {
        include: {
            tag: true
        }
        },
        author: {
        select: {
            name: true,
            userImage: true
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
    }

    const exactMatchPosts = await prisma.post.findMany({
        where: {
        tags: {
            some: {
            tag: {
                name: searchText
            }
            }
        }
        },
        include
    })

    const exactMatchPostIds = exactMatchPosts.map(post => post.id)

    const partialMatchPosts = substrings.length
        ? await prisma.post.findMany({
            where: {
            id: {
                notIn: exactMatchPostIds
            },
            OR: substrings.map(substring => ({
                tags: {
                some: {
                    tag: {
                    name: {
                        contains: substring
                    }
                    }
                }
                }
            }))
            },
            include
        })
        : []

    const blogs = [...exactMatchPosts, ...partialMatchPosts]

    return blogs.map(blog => ({
        ...blog,
        tags: blog.tags.map(postTag => postTag.tag.name),
        savedBy: blog.savedBy.length > 0
    }))
}