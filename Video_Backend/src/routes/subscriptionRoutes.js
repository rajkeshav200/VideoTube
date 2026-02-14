import { Router } from 'express'
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from '../controller/contSubscription.js'
import { verifyJWT } from '../middlewares/authMiddleware.js'

const subsrouter = Router()

subsrouter.use(verifyJWT)

subsrouter.route("/c/:channelId")
.get(getUserChannelSubscribers)
.post(toggleSubscription)

subsrouter.route("/u/:subscriberId").get(getSubscribedChannels)

export default subsrouter