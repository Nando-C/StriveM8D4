import createError from "http-errors"

export const adminOnly = (req, res, next) => {
    if (req.author.role === "Admin") {
        next()
    } else {
        next(createError(403, "Admins only!"))
    }
}