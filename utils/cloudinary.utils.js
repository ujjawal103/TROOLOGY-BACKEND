const cloudinary = require("../cloudinary/cloudinary.config");

const cloudUpload = async ( buffer, folder = "troology", publicId = null ) => {
    try {
        return await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder,
                    public_id: publicId,
                    resource_type: "auto"
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                }
            ).end(buffer);
        });
    } catch (error) {
        console.error(
            "Cloudinary Upload Error:",
            error.message
        );
        throw error;
    }
};

const cloudDelete = async (publicId) => {
    try {
        return await cloudinary.uploader.destroy(
            publicId
        );
    } catch (error) {
        console.error(
            "Cloudinary Delete Error:",
            error.message
        );
        throw error;
    }
};

module.exports = {
    cloudUpload,
    cloudDelete
};