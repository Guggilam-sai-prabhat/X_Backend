import express from "express"
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js"
import tweetRouter from "./routes/tweetRoute.js"
import cors from "cors"

dotenv.config({
    path: ".env"
})

databaseConnection();
const app = express();

//middleware

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(cookieParser())
// const corsOtions = {
//     origin: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }
app.use((req, res, next) => {
  console.log("CORS middleware executed");
  next();
});

app.use(cors());


app.use(cors())

//api
app.use("/api/v1/user", userRouter)
app.use("/api/v1/tweet", tweetRouter)

app.get("/", (req, res, next) => {
    return res.status(200)
        .json({
            success: true,
            message: "HELLO WORLD AGAIN"
        })
})

const PORT = process.env.PORT || 8080
app.listen(process.env.port, () => {
    console.log(`server is running at port ${PORT}`)
})




