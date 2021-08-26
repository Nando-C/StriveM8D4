export const badRequestMiddleware = (err, req, res, next) => {
    if (err.status === 400) {
      res.status(400).send(err.errorsList)
    } else {
      console.log(err);
      next(err)
    }
  }

  export const unAuthenticatedHandler = (err, req, res, next) => {
    if (err.status === 401) {
      res.status(401).send(err.message || "You are not logged in!")
    } else {
      next(err)
    }
  }

  export const forbiddenHandler = (err, req, res, next) => {
    if (err.status === 403) {
      res.status(403).send(err.message || "You are not allowed to do that!")
    } else {
      next(err)
    }
  }

  export const notFoundMiddleware = (err, req, res, next) => {
    if (err.status === 404) {
      res.status(404).send({ successful: false, message: err.message })
    } else {
      console.log(err)
      next(err)
    }
  }
  
  export const catchAllErrorsMiddleware = (err, req, res, next) => {
    console.log(err)
    res.status(500).send("Generic Server Error")
  }