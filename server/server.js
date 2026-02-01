import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectToMongoDb from "./db/connectToMongoDb.js"
import cors from 'cors'

import userRoutes from "./routes/user.routes.js"
import outageRoutes from "./routes/outage.routes.js"

dotenv.config()

const PORT = process.env.PORT

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.json({ message: 'hello world'})
})

app.use("/api/user", userRoutes)
app.use("/api/outage", outageRoutes)

app.listen(PORT, async() => {
    await connectToMongoDb()
    console.log(`Server is listening on port: ${PORT}`)
})