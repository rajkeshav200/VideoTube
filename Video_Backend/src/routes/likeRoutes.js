import { Router } from "express";
//import router from "./commentRoutes";
import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controller/likeController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const likerouter = Router()
likerouter.use(verifyJWT)
likerouter.route("/toggle/v/:videoId").post(toggleVideoLike)
likerouter.route("/toggle/c/:commentId").post(toggleCommentLike)
likerouter.route("/toggle/t/:tweetId").post(toggleTweetLike)
likerouter.route("/likeVideo").get(getLikedVideos)

export default likerouter;