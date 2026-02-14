import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponce.js";
import { User } from "../models/user.models.js";
import { asynchandler } from "../utils/asynchandler.js";


const toggleSubscription = asynchandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user._id;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    if (channelId.toString() === subscriberId.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    const existSubscriber = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    });

    let isSubscribed;

    if (existSubscriber) {
        await existSubscriber.deleteOne();
        isSubscribed = false;
    } else {
        await Subscription.create({
            subscriber: subscriberId,
            channel: channelId
        });
        isSubscribed = true;
    }

    const subscribersCount = await Subscription.countDocuments({
        channel: channelId
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            { isSubscribed, subscribersCount },
            "Subscription toggled successfully"
        )
    );
});

const getUserChannelSubscribers = asynchandler(async (req, res) => {
    const { channelId } = req.params
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username avatar")

    return res
        .status(200)
        .json(new ApiResponse(200, subscribers, "Channel subscribers fetched successfully"))
})

const getSubscribedChannels = asynchandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id")
    }

    const channels = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "username avatar")

    return res
        .status(200)
        .json(new ApiResponse(200, channels, "Subscribed channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}