const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {

   const  {authorization} = req.headers

   if (!authorization) {
    res.send({
        status: 500,
        message: "Token is required",
    })
   }

   else if (authorization.indexOf('bearer') === -1) {
    res.send({
        status: 500,
        message: "try again",
    })
   }
   
   else {
    const token = authorization.slice(7)
    const jwtKey= "uzi" 

    const decode = jwt.decode(token, jwtKey)
    if (decode) {
        next()
    }
    else {
        res.send({
            status: 500,
            message: "invalid token",
        })
    }
   }


}

module.exports = verifyToken