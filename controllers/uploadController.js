
// backend/controllers/uploadController.js  
const imagekit = require('../config/imagekit');
const { createError } = require('../utils/errors');

exports.getAuthParams = async (req, res, next) => {
    try {
        const authenticationParameters = imagekit.getAuthenticationParameters();
        res.json(authenticationParameters);
    } catch (error) {
        next(error);
    }
};

exports.uploadImage = async (req, res, next) => {
    try {
        const { file } = req;
        if (!file) {
            throw createError(400, 'No file provided');
        }

        const result = await imagekit.upload({
            file: file.buffer.toString('base64'),
            fileName: `${Date.now()}-${file.originalname}`,
            folder: '/form-builder',
        });

        res.json({
            url: result.url,
            fileId: result.fileId,
        });
    } catch (error) {
        next(error);
    }
};
exports.uploadMultipleImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            throw new Error('No files provided');
        }

        const uploadPromises = req.files.map(file =>
            imagekit.upload({
                file: file.buffer.toString('base64'),
                fileName: `${Date.now()}-${file.originalname}`,
                folder: '/form-builder'
            })
        );

        const results = await Promise.all(uploadPromises);

        res.json({
            urls: results.map(result => result.url),
            fileIds: results.map(result => result.fileId)
        });
    } catch (error) {
        next(error);
    }
},

    exports.deleteImage = async (req, res, next) => {
        try {
            const { fileId } = req.params;

            await imagekit.deleteFile(fileId);

            res.json({
                status: 'success',
                message: 'Image deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
