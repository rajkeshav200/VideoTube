import { Router } from "express";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist

} from "../controller/playListcont.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const playrouter = Router()
playrouter.use(verifyJWT)

playrouter.route("/").post(createPlaylist)
playrouter.route("/:playlistId")
.get(getPlaylistById)
.patch(updatePlaylist)
.delete(deletePlaylist)

playrouter.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
playrouter.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)

playrouter.route("/user/:userId").get(getUserPlaylists);

export default playrouter;

