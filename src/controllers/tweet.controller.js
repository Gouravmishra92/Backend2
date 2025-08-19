import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const ownerId = req.user._id;
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }
    if (!isValidObjectId(ownerId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const tweet = await Tweet.create({ owner: ownerId, content });
    res.status(201).json(new ApiResponse(200, tweet, "Tweet created successfully", tweet));
})

const getUserTweets = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const tweets = await Tweet.find({ "owner": userId }).populate("owner", "name username profilePicture")
    if (!tweets) {
        throw new ApiError(404, "No tweets found for this user");
    }

    res
        .status(200)
        .json(new ApiResponse(200, tweets, "Tweet fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }
    const tweet = await Tweet.findByIdAndUpdate(tweetId, { content }, { new: true });
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    res.status(200).json(new ApiResponse(200, {}, "Tweet updated successfully", tweet))
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }
    const tweet = await Tweet.findByIdAndDelete(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
    res.status(200).json(new ApiResponse(200, {}, "Tweet deleted successfully", tweet));
})


export { createTweet, getUserTweets, updateTweet, deleteTweet };
