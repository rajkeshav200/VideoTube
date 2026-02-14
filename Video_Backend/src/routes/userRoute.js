import {Router} from 'express'
import { registeruser } from '../controller/contRegisteruser.js'
import {upload} from "../middlewares/multerMiddleware.js"
import { login } from '../controller/contRegisteruser.js'
import { logout } from '../controller/contRegisteruser.js'
import { verifyJWT } from '../middlewares/authMiddleware.js'
import { refreshAccessToken } from '../controller/contRegisteruser.js'
import { getcurrentuser } from '../controller/contRegisteruser.js'
import { changePassword } from '../controller/contRegisteruser.js'
import { updateAccountDetails } from '../controller/contRegisteruser.js'
import { updateUserAvatar } from '../controller/contRegisteruser.js'
import { updateCoverImage } from '../controller/contRegisteruser.js'
import { getUserChannelProfile } from '../controller/contRegisteruser.js'
import { getWatchHistory } from '../controller/contRegisteruser.js'

const userrouter = Router()

userrouter.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),registeruser
)
userrouter.route("/login").post(login)

//secured routes
userrouter.route("/logout").post(verifyJWT, logout)
userrouter.route("/currentuser").get(verifyJWT,getcurrentuser)
userrouter.route("/refreshtoken").post(refreshAccessToken)
userrouter.route("/changepassword").put(verifyJWT,changePassword)
userrouter.route("/update-account").patch(verifyJWT,updateAccountDetails)

//avatar and coverImage are uploaded using UPLOAD
userrouter.route("/avatar").patch(verifyJWT, upload.single("avatar"),updateUserAvatar)
userrouter.route("/coverImage").patch(verifyJWT, upload.single("coverImage"),updateCoverImage)

userrouter.route("/c/:username").get(verifyJWT, getUserChannelProfile)
userrouter.route("/history").get(verifyJWT, getWatchHistory)

export default userrouter