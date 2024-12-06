const {PrismaClient}=require('@prisma/client')
const prisma=new PrismaClient;

const cors=require('cors')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


const hashpassword=async(password)=>
{
    return await bcrypt.hash(password,10);
}
//Registration 
const register=async (req,res)=>
{

    const{name,password,email,role}=req.body
    try
    {
        if(!name|| !password||!email||!role)
        return res.status(400).send("all feilds are required")
        //checking the user exist or not 
        const existingUser=await prisma.user.findUnique(
            {
                where:{email}
            })
            if(existingUser)
            {
                return res.status(400).json({error:"user already exists"})
            }
            const hashedpassword=await hashpassword(password);
            const user=await prisma.user.create({
                data:{name,email,role,password:hashedpassword,}
            })
            console.log("user created",user)
            res.status(201).json({message:"registration is succesfull",user})


    }
    catch(error)
    {
        res.status(500).json({error:"Registration is failed",details:error.message})

    }
};

//Login 
const comparePassword=async(inputpswd,storedpswd)=>
{
    return await bcrypt.compare(inputpswd,storedpswd)
}
const createToken=(userId)=>
{
    const secretKey=process.env.JWT_SECRET
    return jwt.sign({userId},secretKey,{expiresIn:'1h'})
}

const login=async(req,res)=>
{
    const {email,password}=req.body;
    try{
        if(!email||!password){
            res.status(400).json({message:"enter email and password are important"})
        }
        console.log("searching for an email",email)
//fetching user from the db
        const user=await prisma.user.findUnique({    
            where:{email}
        })
        console.log("result",user)
        if(!user)
        {
            return res.status(404).json({message:'user not found'})
        }
        const ispswdValid=await comparePassword(password,user.password)
        if(!ispswdValid)
        {
            return res.status(401).json({message:"invalid credentails"})
        }
        const token=createToken(user.id)
        return res.status(200).json({message:"login successfully",token})
    }
    catch(error)
    {
        console.log("error occured",error)
        return res.status(500).json({message:"login fails"})
    }
}


module.exports={register,login};
