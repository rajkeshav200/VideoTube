import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { Subscription } from "../models/subscription.model.js";
import ApiResponse from "../utils/ApiResponce.js";

const getChannelStats = asynchandler(async (req, res) => {
    //Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.user._id

    const totalvideos = await Video.countDocuments({owner:channelId})
    const totalsubscribers = await Subscription.countDocuments({channel:channelId})

    const viewagg = await Video.aggregate([
        {$match:{owner:new mongoose.Types.ObjectId(channelId)}},
        {$group:{_id:null,totalviews:{$sum:"$views"}}}
    ])

    const totalviews = viewagg[0]?.totalviews||0

    const likesAgg = await Like.aggregate([
        {
            $match: { likevideo: { $ne: null } }
        },
        {
            $lookup:{
                from:"videos",
                localField:"likevideo",
                foreignField:"_id",
                as:"video"
            }
        },
        {$unwind:"$video"},
        {
            $match: {
                "video.owner": new mongoose.Types.ObjectId(channelId)
            }
        },
        {$count:"totallikes"}
    ])
    const totalLikes = likesAgg[0]?.totallikes || 0

    return res.status(200).json(
        new ApiResponse(200, {
            totalvideos,
            totalsubscribers,
            totalLikes,
            totalviews
        }, "Channel stats fetched successfully")
    )
})

const getChannelVideos = asynchandler(async (req, res) => {
    // Get all the videos uploaded by the channel
    const channelId = req.user._id

    const allVideos = await Video.find({owner:channelId})
    .sort({createdAt:-1})
    .populate("owner","username avatar")

    return res
    .status(200)
    .json(new ApiResponse(200, allVideos, "Channel videos fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }