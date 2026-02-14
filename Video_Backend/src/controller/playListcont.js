import mongoose, { isValidObjectId } from "mongoose";
import { PlayList } from "../models/playList.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponce.js";
import { asynchandler } from "../utils/asynchandler.js";

const createPlaylist = asynchandler(async (req, res) => {
    const { name, description } = req.body
    if (!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }

    const playlist = await PlayList.create({
        name,
        description,
        owner: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(201, playlist, "Playlist created successfully")
    )
})

const getUserPlaylists = asynchandler(async (req, res) => {
    const { userId } = req.params
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "invalid userId")
    }
    const playlists = await PlayList.find({ owner: userId })

    return res.status(200).json(
        new ApiResponse(200, playlists, "User playlists fetched")
    )
})

const getPlaylistById = asynchandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await PlayList.findById(playlistId)
        .populate("videos")
        .populate("owner", "username email")

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched")
    )
})

const addVideoToPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video id")
    }

    const playlist = await PlayList.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not allowed to modify this playlist")
    }

    const updatedPlaylist = await PlayList.findByIdAndUpdate(
        playlistId,
        {$addToSet:{videos:videoId}},
        {new:true}
    )
    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video added to playlist")
    )
})

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    //remove video from playlist

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video id")
    }

    const playlist = await PlayList.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not allowed to modify this playlist")
    }

    const updatedPlaylist = await PlayList.findByIdAndUpdate(
        playlistId,
        {$pull:{videos:videoId}},
        {new:true}
    )
    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video removed from playlist")
    )
})

const deletePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params

     if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await PlayList.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not allowed to delete this playlist")
    }

    await PlayList.findByIdAndDelete(playlistId)

    return res.status(200).json(
        new ApiResponse(200, {}, "Playlist deleted successfully")
    )
})

const updatePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    
     if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }

    const playlist = await PlayList.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not allowed to update this playlist")
    }

    const updatedPlaylist = await PlayList.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                ...(description && {description}),
                ...(name && {name})
            }
        },
        {new:true}
    )
    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}