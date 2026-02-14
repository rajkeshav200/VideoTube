import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorHandler } from './middlewares/error.middleware.js'
// import userrouter from './routes/userRoute.js'
// import videorouter from './routes/videoRoutes.js'
// import tweetrouter from './routes/tweetRoutes.js'
// import subsrouter from './routes/subscriptionRoutes.js'
// import playrouter from './routes/playlistRoutes.js'
// import healthrouter from './routes/healthcheckRoutes.js'
// import dashrouter from './routes/dashboardRoutes.js'
// import commentrouter from './routes/commentRoutes.js'
// import likerouter from './routes/likeRoutes.js'

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userrouter from './routes/userRoute.js'
import videorouter from './routes/videoRoutes.js'
import tweetrouter from './routes/tweetRoutes.js'
import subsrouter from './routes/subscriptionRoutes.js'
import playrouter from './routes/playlistRoutes.js'
import healthrouter from './routes/healthcheckRoutes.js'
import dashrouter from './routes/dashboardRoutes.js'
import commentrouter from './routes/commentRoutes.js'
import likerouter from './routes/likeRoutes.js'


app.use('/api/user',userrouter)
app.use('/api/healthcheck',healthrouter)
app.use('/api/dashboard',dashrouter)
app.use('/api/like',likerouter)
app.use('/api/comment',commentrouter)
app.use('/api/playlist',playrouter)
app.use('/api/video',videorouter)
app.use('/api/tweet',tweetrouter)
app.use('/api/subscription',subsrouter)

app.use(errorHandler)

export default app