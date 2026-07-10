import { asynchandler } from "../utils/asynchandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponce.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import cloudinary from "../utils/cloudinary.js"
import { User } from "../models/user.models.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"



const generateAccessAndRefreshToken = async (userid) => {

    try {
        const user = await User.findById(userid)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        console.log("Token generation failed")
        console.log(error)
        throw new ApiError(401, "something went wrong while generating Tokens")
    }
}
// const registeruser = asynchandler(async (req, res, next) => {
//     const { username, email, password, fullname } = req.body;

//     if ([username, email, password, fullname].some((field) => !field?.trim())) {
//         throw new ApiError(400, "All fields are required");
//     }

//     const alreadyexist = await User.findOne({ $or: [{ username }, { email }] });
//     if (alreadyexist) {
//         throw new ApiError(409, "User is already registered!");
//     }

//     const avatarlocalpath = req.files?.avatar?.[0]?.path;
//     if (!avatarlocalpath) {
//         throw new ApiError(400, "Avatar file is required");
//     }
//     console.log("Avatar local path:", avatarlocalpath);


//     const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

//     const avatar = await uploadOnCloudinary(avatarlocalpath);
//     const coverImage = await uploadOnCloudinary(coverImageLocalPath);
//     console.log("Avatar local path:", avatarlocalpath);


//     if (!avatar) {
//         throw new ApiError(400, "Avatar upload failed");
//     }

//     const user = await User.create({
//         username: username.toUpperCase(),
//         avatar: avatar.url,
//         coverImage: coverImage?.url || "",
//         email,
//         password,
//         fullname
//     });

//     const createdUser = await User.findById(user._id).select(
//         "-password -refreshToken"
//     );

//     if (!createdUser) {
//         throw new ApiError(500, "User creation failed");
//     }

//     const userData = createdUser.toObject();
//     delete userData.password;
//     return res
//         .status(200)
//         .json(new ApiResponse(200, userData, "User successfully created"));
// });

const registeruser = asynchandler(async (req, res, next) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
    const { username, email, password, fullname } = req.body

    // if(fullname==""){
    //     throw new ApiError(404,"something went wrong!")
    // } a way to check for all parameters but it takes to much time

    if (
        [username, email, password, fullname].some(
            (field) => typeof field !== "string" || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const alreadyexist = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (alreadyexist) {
        //console.log(username)
        throw new ApiError(409, "User is already registered!")
    }

    const avatarlocalpath = req.files?.avatar?.[0]?.path
    // console.log("BODY:", req.body);
    // console.log("FILES:", req.files)

    if (!avatarlocalpath) {
        throw new ApiError(400, "Avatar file is required bro")
    }

    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    const avatar = await uploadOnCloudinary(avatarlocalpath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "avatar is required")
    }

    const user = await User.create({
        username: username.toUpperCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        fullname
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "something went wrong user doesn't created")
    }

    return res.status(200).json(
        new ApiResponse(200, createdUser, "user successfully created")
    )


    //checking purpose
    // res.status(200).json({
    //     message:"okayq"
    // })
})

const login = asynchandler(async (req, res) => {
    const { email, password, username } = req.body
    const isProd = process.env.NODE_ENV === "production";

    if (!username && !email) {
        console.log("email is required")
        throw new ApiError(401, "required fields")
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(401, "user doesn't exists")
    }

    const passwordcorrect = await user.isPasswordCorrect(password)
    if (!passwordcorrect) {
        throw new ApiError(401, "wrong password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    const loggedinUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                loggedinUser, accessToken, refreshToken
            },
                "user loged in successfully"
            )
        )
})

const logout = asynchandler(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    await User.findByIdAndUpdate(
        req.user._id, {
        $unset: {
            refreshToken: 1 // this removes the token from documents
        }
    },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    }

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(
            new ApiResponse(200, {}, "user LoggedOut Successfull")
        )
})

const refreshAccessToken = asynchandler(async (req, res) => {
    const newrefreshToken = req.cookies.refreshToken || req.headers["refresh-token"]

    if (!newrefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodeToken = jwt.verify(
            newrefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodeToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh Token")
        }
        if (newrefreshToken !== user.refreshToken) {
            throw new ApiError(401, "refresh Token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        }

        const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id)
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        res.
            status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, {
                accessToken, refreshToken
            },
                "access Token refreshed"
            ))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token")
    }
})

const changePassword = asynchandler(async (req, res) => {
    const { oldPassword, newPassword, confirmnewPass } = req.body

    if (newPassword !== confirmnewPass) {
        throw new ApiError(401, "Password Mismatch")
    }
    const user = await User.findById(req.user?._id)
    const matchPassword = user.isPasswordCorrect(oldPassword)

    if (!matchPassword) {
        throw new ApiError(401, "Wrong password")
    }
    user.password = newPassword

    res
        .status(200)
        .json(new ApiResponse(200, {}, "password changes sucessfully"))
})

const getcurrentuser = asynchandler(async (req, res) => {
    const user = req.user
    res
        .status(200)
        .json(new ApiResponse(200, {
            user,
        }, "user fetched successfully"))
})

const updateAccountDetails = asynchandler(async (req, res) => {
    const { fullname, email } = req.body

    if (!fullname || !email) {
        throw new ApiError(401, "Both fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname: fullname,
                email: email
            }
        },
        { new: true }
    ).select("-password")

    res
        .status(200)
        .json(new ApiResponse(200, user, "Account updated successfully"))

});

const updateUserAvatar = asynchandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    // console.log("FILE:", req.file);
    // console.log("USER:", req.user?._id);
    // DELETE THE OLD IMAGE BEFORE UPLOADING NEWONE
    if (user.avatar) {
        //extracting public url to remove avatar
        const publicID = user.avatar.split('/').pop().split('.')[0]
        await cloudinary.uploader.destroy(publicID)
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
    }

    const updateuser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    res
        .status(200)
        .json(new ApiResponse(200, updateuser, "avatar is updated successfully"))
})

const updateCoverImage = asynchandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on coverImage")
    }

    const updateduser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        }, { new: true }
    ).select("-password")

    res
        .status(200)
        .json(new ApiResponse(200, updateduser, "cover Image is updated successfully"))
})

const getUserChannelProfile = asynchandler(async (req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }
    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])
    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "User channel fetched successfully")
        )
})

const getWatchHistory = asynchandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory || [],
                "Watch history fetched successfully"
            )
        )
})

export {
    registeruser,
    login,
    logout,
    refreshAccessToken,
    changePassword,
    getcurrentuser,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getWatchHistory
}