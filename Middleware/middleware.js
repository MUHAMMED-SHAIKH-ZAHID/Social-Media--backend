import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


dotenv.config()

const verifyToken = async (req, res, next) => {
    let token
    try {
        let authHeader = req.headers.authorization
        if (authHeader == undefined) {
         
            //res.status(401).send({error:"No token provided"})
        } else {

            token = authHeader.split(" ")[1] //or pop()  
        }

        if (token) {
            console.log("its ihe jwt token 🤷‍♀️🤷‍♀️🤷‍♀️");
            const decoded = jwt.verify(token,process.env.JWT_KEY)
            
            req.userId = decoded?.id
            console.log(req.userId,"its the decoded userid in the middleware🔥🔥🔥");

        }
        next()
    } catch (error) {
        res.status(500).send({ error: "Token Expired" })
    }
}
export default verifyToken;