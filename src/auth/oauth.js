import passport from "passport"
import GoogleStrategy from 'passport-google-oauth20'
import AuthorModel from '../services/authors/schema.js'
import { JWTAuthenticate } from "./tools.js"

const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "http://localhost:3001/authors/googleRedirect",
    },
    
    async (accessToken, refreshToken, profile, passportNext) => {
        try {
            console.log(profile)
            const author = await AuthorModel.findOne({googleId: profile.id})

            if (author) {
                const tokens = await JWTAuthenticate(author)
                passportNext(null, {tokens})
            } else {
                const newAuthor = {
                    name: profile.name.givenName,
                    surname: profile.name.familyName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    googleId: profile.id,
                }

                const createdAuthor = new AuthorModel(newAuthor)
                const savedAuthor = await createdAuthor.save()
                const tokens = await JWTAuthenticate(savedAuthor)

                passportNext(null, { author: savedAuthor, tokens })
            }
        } catch (error) {
            console.log(error)
            passportNext(error)
        }
    }
)

passport.serializeUser(function (author, passportNext) {
    passportNext(null, author)
})

export default googleStrategy