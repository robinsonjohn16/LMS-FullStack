import { config } from 'dotenv';
config();
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/courses.routes.js';
import paymentRoutes from './routes/payment.routes.js'
import errorMiddleware from './Middlewares/error.middleware.js';
const app=express()


//middleware
app.use(express.json())
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true
}))
app.use(cookieParser())
app.use(morgan('dev'))
//it is  used as a middleware to extract details from encoded urls like forgotpasswordUrl
app.use(express.urlencoded({extended:true}))
app.use('/ping',(req,res)=>{
    res.status(200).send('चलत तौ है..')
})
//route of 3 modules
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/courses',courseRoutes)
app.use('/api/v1/payment',paymentRoutes)
app.use('*',(req,res)=>{
    res.status(404).send('Oops! Page Not Found')
})
app.use(errorMiddleware)//It handles unwanted errors.
                                                    
export default app;