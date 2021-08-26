import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema, model } = mongoose

const AuthorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: `https://ui-avatars.com/api/?name=John+Doe`,
        },
    },
    {
        timestamps: true
    }
)

// Hash new pasword BEFORE saving it to the DB
AuthorSchema.pre("save", async function (next) {
    const newAuthor = this
    const plainPW = newAuthor.password

    if (newAuthor.isModified("password")) {
        newAuthor.password = await bcrypt.hash(plainPW, 10)
    }
    next()
})

AuthorSchema.methods.toJSON = function () {
    const authorDocument = this
    const authorObject = authorDocument.toObject()

    delete authorObject.password
    delete authorObject.__v

    return authorObject
}

AuthorSchema.statics.checkCredentials = async function (email, plainPW) {
    const author = await this.findOne({ email})

    if( author) {
        const isMatch = await bcrypt.compare(plainPW, author.password)

        if(isMatch) return author
        else return null

    } else {
        return null
    }
}

export default model('Author', AuthorSchema)