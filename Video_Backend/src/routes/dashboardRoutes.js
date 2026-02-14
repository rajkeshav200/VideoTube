import { Router } from "express";
import {
    getChannelStats,
    getChannelVideos
} from "../controller/contrDashboard.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const dashrouter = Router()

dashrouter.use(verifyJWT)

dashrouter.route("/stats").get(getChannelStats)
dashrouter.route("/videos").get(getChannelVideos)

export default dashrouter