import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponce.js";
import { asynchandler } from "../utils/asynchandler.js";


const toggleVideoLike = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //toggle like on video

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const existinglike = await Like.findOne({
        likevideo: videoId,
        likedBy: req.user._id
    })
    if (existinglike) {
        await Like.findByIdAndDelete(existinglike._id)
        return res.status(200).json(
            new ApiResponse(200, "Video unliked")
        )
    }

    await Like.create({
        likevideo: videoId,
        likedBy: req.user._id
    })
    return res.status(200).json(
        new ApiResponse(200, "Video liked")
    )
})

const toggleCommentLike = asynchandler(async (req, res) => {
    const { commentId } = req.params
    //toggle like on comment
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(
            new ApiResponse(200, "Comment unliked")
        )
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user._id
    })
    return res.status(200).json(
        new ApiResponse(200, "Comment liked")
    )
})

const toggleTweetLike = asynchandler(async (req, res) => {
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(
            new ApiResponse(200, "Tweet unliked")
        )
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    })

    return res.status(200).json(
        new ApiResponse(200, "Tweet liked")
    )
})

const getLikedVideos = asynchandler(async (req, res) => {
    //get all liked videos
    const allLikes = await Like.find({
        likedBy:req.user._id,
        likevideo:{$ne:null}
    })
    .populate("likevideo")
     return res.status(200).json(
        new ApiResponse(200, allLikes, "Liked videos fetched")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
