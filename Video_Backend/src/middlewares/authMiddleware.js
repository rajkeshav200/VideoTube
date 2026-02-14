import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";


export const verifyJWT = asynchandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
        throw new ApiError(401, "Unauthorized request")
    }
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user
    next();

})