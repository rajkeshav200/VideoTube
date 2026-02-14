import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponce.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Like } from "../models/like.model.js";

/*Aggregation pipeline
Pagination plugin
ObjectId validation
Authorization check (owner === user)
Cloudinary integration
Multer file handling
MVC controller structure
Polymorphic Like system you shared earlier fits perfectly with this Video model*/

/*
One-to-Many Relationship using Referencing:
One Video → many Likes
One User → many Likes

And your full Like schema is:
Polymorphic Relationship
One Like → Video OR Comment OR Tweet
*/
const getAllVideo = asynchandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

        const match = { isPublished: true }
        if (query) {
            match.title = { $regex: query, $options: "i" }
        }

        if (userId && isValidObjectId(userId)) {
            match.owner = new mongoose.Types.ObjectId(userId)
        }

        const sortStage = {
            [sortBy]: sortType === "asc" ? 1 : -1
        }

        const aggregate = Video.aggregate([
            { $match: match },
            { $sort: sortStage },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [{ $project: { password: 0, refreshToken: 0 } }]
                }
            },
            { $unwind: "$owner" }
        ])

        const videos = await Video.aggregatePaginate(aggregate, {
            page: Number(page),
            limit: Number(limit)
        })

        return res.status(200).json(
            new ApiResponse(200, videos, "Videos fetched successfully")
        )
    } catch (error) {
        console.error("getAllVideo error:", error);
        return res.status(500).json({ message: "Failed to fetch videos" });
    }

})

const publishAVideo = asynchandler(async (req, res) => {
    const { title, description } = req.body
    //get video, upload to cloudinary, create video

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    const videoLocalPath = req.files?.videoFile?.[0].path
    const thumbnailLocalPath = req.files?.thumbnail?.[0].path

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video file and thumbnail are required")
    }
    const uploadVideo = await uploadOnCloudinary(videoLocalPath)
    const uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!uploadVideo || !uploadThumbnail) {
        throw new ApiError(500, "Cloudinary upload failed")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: uploadVideo.url,
        thumbnail: uploadThumbnail.url,
        duration: uploadVideo.duration || 0,
        owner: req.user._id
    })

    return res.status(200).json(
        new ApiResponse(200, video, "Video created successfully")
    )
})

const getVideoById = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //get video by id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },
        { new: true }
    ).populate("owner", "-password -refreshToken")

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { watchHistory: videoId }
        }
    );
    //console.log("USER IN VIDEO:", req.user);

    const likesCount = await Like.countDocuments({
        likevideo: video._id
    });

    const isLiked = await Like.exists({
        likevideo: video._id,
        likedBy: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200,
            {
                ...video.toObject(),
                likesCount,
                isLiked: Boolean(isLiked)
            },
            "Video fetched successfully")
    )
})

const updateVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //update video details like title, description, thumbnail
    const { title, description } = req.body

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found");

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this video")
    }
    if (title) Video.title = title
    if (description) Video.description = description

    if (req.files?.path) {
        const uploadThumbnail = await uploadOnCloudinary(req.files.path)
        if (uploadThumbnail?.url) Video.thumbnail = uploadThumbnail.url
    }

    await video.save()

    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    )
})

const deleteVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //delete video

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) throw new ApiError(404, "Video not found")

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this video")
    }

    await Video.findByIdAndDelete(videoId)

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})

const togglePublishStatus = asynchandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findById(videoId)

    if (!video) throw new ApiError(404, "Video not found")

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to change status")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res.status(200).json(
        new ApiResponse(200, video, "Publish status updated")
    )
})

export {
    getAllVideo,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}

