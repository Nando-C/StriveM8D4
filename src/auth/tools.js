import jwt from 'jsonwebtoken'

export const JWTAuthenticate = async user => {
    const accessToken = await generateJWT({ _id: user._id})

    return accessToken
}

const generateJWT = payload => new Promise((resolve, reject) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h"}, (err, token) => {
    if (err) reject(err)
    resolve(token)
    })
)

export const verifyJWT = token => new Promise((resolve, reject) => jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) reject(err)
    resolve (decodedToken)
}))
