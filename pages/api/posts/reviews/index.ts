import { NextApiRequest, NextApiResponse } from "next";
import { DefaultResponse } from "../../../../apis/types";
import prisma from "../../../../lib/prisma";

export interface PresignedUrlResponse extends DefaultResponse {
  result?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PresignedUrlResponse>
) {
  if (req.method === "POST") {
    try {
      const { content, images, title, userId, restaurantId } = req.body;

      await prisma.$transaction(async (prisma) => {
        const { id: reviewId } = await prisma.reviews.create({
          data: {
            userId,
            restaurantId,
            title,
            content,
          },
        });

        await prisma.reviewImages.create({
          data: {
            urls: images.join(),
            restaurantId: restaurantId,
            userId,
            reviewId,
          },
        });
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  }

  return res.status(400).json({ success: false });
}
