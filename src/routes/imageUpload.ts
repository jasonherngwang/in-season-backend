import express, { Request, Response } from 'express';
import multer from 'multer';
import { S3 } from 'aws-sdk';
import url from 'url';
import { v4 as uuidv4 } from 'uuid';
import config from '../utils/config';
import { AuthenticationError, UploadError } from '../utils/errors';

const imageUploadRouter = express.Router();

const MAX_SIZE = 5 * 1_024 * 1_024; // Limit 5 MB

const s3 = new S3({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_ACCESS_KEY_SECRET,
});

// File restrictions
const allowedMimetypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Configure multer options
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_SIZE },
});

// "image" is the fieldname in the form-data
imageUploadRouter.post(
  '/upload',
  upload.single('image'),
  async (req: Request, res: Response) => {
    const { file, user } = req;

    if (!user) {
      throw new AuthenticationError('must be logged in to modify food');
    }

    if (!file) {
      throw new UploadError(
        'error uploading image; accept jpeg, png, webp, gif < 5 MB',
      );
    }

    // Generate a unique filename
    const filename = `${user._id}/${uuidv4()}-${file.originalname}`;

    const params: S3.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: filename,
      Body: file.buffer, // Multer stores files in memory as buffer objects
      ContentType: file.mimetype, // Specify Content-Type to open in browser
    };

    const result = await s3
      .upload(params, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
        return;
      })
      .promise();

    // Convert S3 URL to CloudFront URL
    const cloudfrontUrl = `${config.CLOUDFRONT_DISTRIBUTION_URL}${
      url.parse(result.Location).path
    }`;

    return res.json({
      message: 'File uploaded successfully',
      imageUrl: cloudfrontUrl,
    });
  },
);

export default imageUploadRouter;
