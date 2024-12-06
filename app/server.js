const express=require('express')
require('dotenv').config();
const userRoute=require('./routes/userRoute')

const app=express();



app.use(express.json())
app.use('/app/user',userRoute)

const PORT=process.env.PORT||9090;

app.listen(PORT,()=>
{
    console.log("SERVER STARTED 😊")
})