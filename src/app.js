import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : "20kb"}))
app.use(express.urlencoded({extended: true, limit: "20kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users",userRouter)

import tweetRouter from './routes/tweet.routes.js'
app.use("/api/v1/tweets",tweetRouter)

import commentRouter from './routes/comment.routes.js'
app.use("/api/v1/comments",commentRouter)

import playlistRouter from './routes/playlist.routes.js'
app.use('/api/v1/playlists',playlistRouter)

export { app }