import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: Process.env.CLOUDINARY_CLOUD_NAME,
    api_key: Process.env.CLOUDINARY_API_KEY,
    api_secret: Process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudianry = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.uploadd(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded  successfull
        console.log("file is uploaded on cloudinary",response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as upload operation got failed
        return null;       
    }
}


export {uploadOnCloudianry}