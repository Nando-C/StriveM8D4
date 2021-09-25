import jwt from 'jsonwebtoken'
import AuthorModel from '../services/authors/schema.js'

export const JWTAuthenticate = async user => {
    const accessToken = await generateJWT({ _id: user._id})
    const refreshToken = await generateRefreshJWT({ _id: user._id})

    user.refreshToken = refreshToken

    await user.save()

    return { accessToken, refreshToken }
}

const generateJWT = payload => new Promise((resolve, reject) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h"}, (err, token) => {
    if (err) reject(err)
    resolve(token)
    })
)

const generateRefreshJWT = payload => new Promise((resolve, reject) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "24h"}, (err, token) => {
    if (err) reject(err)
    resolve(token)
    })
)

export const verifyJWT = token => new Promise((resolve, reject) => jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) reject(err)
    resolve (decodedToken)
}))

const verifyRefreshJWT = token => new Promise((resolve, reject) => jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decodedToken) => {
    if (err) reject(err)
    resolve (decodedToken)
}))

export const refreshTokens = async actualRefreshToken => {
    try {
        const decoded = await verifyRefreshJWT(actualRefreshToken)

        const author = await AuthorModel.findById(decoded._id)

        if( !author) throw new Error('Author not found!')

        if (actualRefreshToken === author.refreshToken) {
            const { accessToken, refreshToken } = await JWTAuthenticate(author)
            return { accessToken, refreshToken }
        } else {
        }
    } catch (error) {
        throw new Error('Token not valid!')
    }
}