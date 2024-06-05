import jwt from "jsonwebtoken"
import dotenv, { config } from "dotenv"
dotenv.config({
    path : "../config/.env"
})


const isAuthenticated = async (req , res , next) =>{
    try{
        const token = req.cookies.token
        console.log(token)
        if(!token){
            return res.status(401).json({
                message : "User not authenticated",

                sucess : false
            })
        }

        const decode = await jwt.verify(token , process.env.TOKEN_SECERET)
        console.log(decode);
        req.user = decode.userId
        next();
    } catch{

    }
}

export default isAuthenticated