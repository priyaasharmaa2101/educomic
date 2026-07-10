import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express, { Request, Response } from 'express';
import cors from "cors";
import connectDB from "./configs/db.js";
import session from "express-session";
import  MongoStore  from "connect-mongo";
import AuthRouter from "./routes/AuthRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import generationRoutes from "./routes/generationRoutes.js"

declare module 'express-session'{
    interface SessionData{
        isLoggedIn:boolean,
        userId:string
    }
}

await connectDB()

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Middleware
app.use(cors({
    origin:['http://localhost:5173', 'http://localhost:3000'],
    credentials:true
}))

app.use(session({
    secret: process.env.SESSION_SECRET as string||"default_backup_secret_key",
    resave: false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24*7
    },//7days
   store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,  
    dbName: "express-data",           
    collectionName: 'sessions'
})
}))



const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

app.use('/api/auth',AuthRouter)
app.use("/api/ai", aiRouter);
app.use("/api/generation", generationRoutes);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});