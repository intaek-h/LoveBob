import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";
import { DefaultResponse } from "../../../apis/types";
import short from "short-uuid";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export interface PresignedUrlResponse extends DefaultResponse {
  result?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PresignedUrlResponse>
) {
  if (req.method === "GET") {
    try {
      const { restaurant, user } = req.query;

      const result = await s3.getSignedUrlPromise("putObject", {
        Bucket: process.env.AWS_S3_BOB_LOVE_IMAGES_BUCKET_NAME,
        Key: `${short.generate()}-${Date.now()}.webp`,
        Expires: 60,
      });

      return res.status(200).json({ success: true, result });
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  }

  return res.status(400).json({ success: false });
}
