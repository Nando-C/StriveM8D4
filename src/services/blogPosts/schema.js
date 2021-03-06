import mongoose from 'mongoose'

const { Schema, model } = mongoose

const PostSchema = new Schema(
    {
        category: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        cover: {
            type: String,
        },
        readTime: {
            value: {
                type: Number,
            },
            unit: {
                type: String,
            },
        },
        author: [{
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Author"
        }],
       
        content: {
            type: String,
            required: true,
        },
        comments: [
            {
                comment: String,
                rate: {
                    type: Number,
                    min: 1,
                    max: 5,
                    default: 1,
                },
                author: [{
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: "Author"
                }],
            }
        ]
    },
    {
        timestamps: true,
    }
)

PostSchema.static('findPostsWithAuthors', async function (query) {
    const total = await this.countDocuments(query.criteria)
    const posts = await this.find(query.criteria, query.options.fields)
        .skip(query.options.skip)
        .limit(query.options.limit)
        .sort(query.options.sort)
        .populate("author", { _id: 0, name: 1, avatar: 1})

    return { total, posts }
})

PostSchema.static('findPostWithAuthors' , async function (postId) {
    const post = await this.findById(postId)
        .populate('author', { _id: 0, name: 1, avatar: 1})
    return post
})

PostSchema.static('findPostCommentsWithAuthors', async function (postId) {
    const postComments = await this.findById(postId)
        .populate({ 
            path: 'comments', 
            populate: { 
                path: "author", 
                select: {_id: 0, name: 1, avatar: 1}
            }
        })

    return postComments
})

PostSchema.static('findPostCommentWithAuthor', async function (postId, commentId) {
    const postComment = await this.findById(postId, { comments: { $elemMatch: { _id: commentId}}})
        .populate({ 
            path: 'comments', 
            populate: { 
                path: "author", 
                select: {_id: 0, name: 1, avatar: 1}
            }
        })

    return postComment
})

export default model("Post", PostSchema)