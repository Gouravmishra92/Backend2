import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const comment = Comment.aggregate([
        {
            $match : {
                video : new mongoose.Types.ObjectId(videoId)
            },
            $lookup:{
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "ownerDetails"
            },
            $project:{
                "ownreDetails.username" : 1,
                content : 1
            }
        }
    ])
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async(req,res) => {
    const {content} = req.body
    const ownerId = req.user._id

    if(!content || content.trim() === ""){
        throw new ApiError(400,"comment is required")
    }

    if(!isValidObjectId(ownerId)){
        throw new ApiError(400,"Invalid User Id")
    }

    const comment = await Comment.create({
        owner : ownerId,
        content
    })

    res
    .status(200)
    .json(new ApiResponse(200, comment ,"Comment created successfully"))

})

const updateComment = asyncHandler(async(req,res) => {
    const {content} = req.body
    const commentId  = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment id")
    }

    if(!content || content.trim() === ""){
        throw new ApiError(400,"Comment is required")
    }

    const comment  = Comment.findByIdAndUpdate(
        commentId,
        {
            content
        },
        {
            new: true
        }
    )

    if(!comment){
        throw new ApiError(400,"Comment is required")
    }

    res
    .status(200)
    .json(new ApiResponse(200,{},"Comment updated successfully"))

})

const deleteComment = asyncHandler(async(req,res) => {
    const {commentId} = req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid Comment Id")
    }

    const comment = await Comment.findByIdAndDelete(commentId)

    if(!comment){
        throw new ApiError(400,"comment id is required")
    }

    res
    .status(200)
    .json(new ApiResponse(200,{},"Comment delete successfully"))
})

export {getVideoComments, addComment, updateComment, deleteComment}