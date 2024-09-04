const cloudinary = require('cloudinary').v2
const fs = require('fs')
require('dotenv').config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

async function cloudUpload(filePath) {
    try {
        if (!filePath) return null;

        const uploadResult = await cloudinary.uploader.upload(
            filePath, {
                resource_type : "image"
            }
        )
        // console.log('upload result' , uploadResult.url)
        return uploadResult
    } catch (error) {
        fs.unlink(filePath);
        return null;       
    }
}


module.exports = {cloudUpload}
    
