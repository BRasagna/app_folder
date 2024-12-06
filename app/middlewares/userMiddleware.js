const express=require('express')
require('dotenv').config();
const jwt=require('jsonwebtoken')
const authMiddleware=async(req,res,next)=>
{
    const authHeader=req.headers.authorization;
    if(!authHeader)
    {
        return res.status(400).json({error:"unauthorized acces"});
       
    }
    const token=authHeader.split(' ')[1];
    try{
        console.log("Authorization header:", req.headers.authorization);
        console.log("Token:", token);

        const decode=jwt.verify(token,process.env.JWT_SECRET)
        console.log("decoded token:",decode)
        req.user=decode;
        next();
    }
    
    catch(error)
    {
        console.log("error occured",error)
        return res.status(401).json({error:"invalid token"})
    }
}
module.exports=authMiddleware;