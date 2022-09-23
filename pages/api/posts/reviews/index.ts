import { NextApiRequest, NextApiResponse } from "next";
import { DefaultResponse } from "../../../../apis/types";
import prisma from "../../../../lib/prisma";
import short from "short-uuid";

export interface PresignedUrlResponse extends DefaultResponse {
  result?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PresignedUrlResponse>
) {
  if (req.method === "POST") {
    try {
      const { content, preview, images, title, titleLink, userId, restaurantId } = req.body;

      await prisma.$transaction(async (prisma) => {
        const { id: reviewId } = await prisma.reviews.create({
          data: {
            userId,
            restaurantId,
            title,
            titleLink: `${titleLink}-${short.generate()}`,
            content,
            preview,
          },
        });

        await prisma.reviewImages.create({
          data: {
            urls: images.join(),
            restaurantId,
            userId,
            reviewId,
          },
        });
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);

      return res.status(400).json({ success: false });
    }
  }

  return res.status(400).json({ success: false });
}
