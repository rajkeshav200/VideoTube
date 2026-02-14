import { Router } from "express";
import {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
} from "../controller/contTweet.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const tweetrouter = Router();
tweetrouter.use(verifyJWT)

tweetrouter.route("/").post(createTweet);
tweetrouter.route("/user/:userId").get(getUserTweets);
tweetrouter.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default tweetrouter