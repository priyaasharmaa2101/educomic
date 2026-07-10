import {Request, Response, NextFunction} from 'express'

declare module 'express-serve-static-core' {
    interface Request {
        userId?: string;
    }
}
const protect= async (req:Request,res:Response,next:NextFunction)=>{
    const {isLoggedIn, userId}= req.session;
    if(!isLoggedIn || !userId){
        return res.json({message:'You are not logged in'});
    }

    next()
}

export default protect