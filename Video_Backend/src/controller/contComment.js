import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponce.js";
import { asynchandler } from "../utils/asynchandler.js"

const getVideoComments = asynchandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);
    const aggregate = Comment.aggregate([
        { $match: { video: new mongoose.Types.ObjectId(videoId) } },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    { $project: { username: 1, avatar: 1 } }
                ]
            }
        },
        {
            $unwind: {
                path: "$owner",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                isLiked: {
                    $in: [userId, "$likes.likedBy"]
                },
                isOwner: { $eq: ["$owner._id", userId] }
            }
        },
        {
            $project: {
                likes: 0
            }
        },
        { $sort: { createdAt: -1 } }
    ])
    const options = {
        page: Number(page),
        limit: Number(limit)
    }

    const comments = await Comment.aggregatePaginate(aggregate, options)

    return res.status(200).json(
        new ApiResponse(200, comments.docs, "Comments fetched successfully")
    )
})

const addComment = asynchandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content is required")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    });

    const populated = await Comment.findById(comment._id)
        .populate("owner", "username avatar")
        .lean()

    return res.status(201).json(
        new ApiResponse(201, {
            ...populated,
            isOwner: true
        }, "Comment added successfully")
    )

})

const updateComment = asynchandler(async (req, res) => {
    // TODO: update a comment
    const { content } = req.body
    const { commentId } = req.params

    // const video = await Comment.findById(videoId)
    // video.content = content
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Updated content is required")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not allowed to update this comment")
    }

    comment.content = content
    await comment.save()

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    )
})

const deleteComment = asynchandler(async (req, res) => {
    // TODO: delete a comment
    const { contentId } = req.params

    if (!mongoose.isValidObjectId(contentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const comment = await Comment.findById(contentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not allowed to delete this comment")
    }

    await Comment.findByIdAndDelete(contentId)

    return res.status(200).json(
        new ApiResponse(200, contentId, "Comment deleted successfully")
    )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}