import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Playlist } from "../models/playlist.model.js"
import mongoose, { isValidObjectId } from "mongoose"

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const ownerId = req.user._id

    if (!isValidObjectId(ownerId)) {
        throw new ApiError(400, "Invalid user id")
    }

    if (!(name && description)) {
        throw new ApiError(400, "name and description required")
    }

    const playlist = await Playlist.create({
        owner: ownerId,
        name,
        description
    })

    res
    .status(200)
    .json(new ApiResponse(200,playlist,"Playlist created successfully"))
})
const getUserPlaylist = asyncHandler(async(req,res) => {
    const {userID} = req.params
    
})

export {createPlaylist}