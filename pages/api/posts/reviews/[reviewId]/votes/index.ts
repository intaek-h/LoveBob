import { DefaultResponse } from "../../../../../../apis/types";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../../lib/prisma";

export interface ReviewVoteCountResponse extends DefaultResponse {
  result?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReviewVoteCountResponse>
) {
  const reviewId = req.query.reviewId as string;

  if (req.method === "GET") {
    try {
      const voteCount = await prisma.reviewLikes.count({
        where: {
          reviewId,
        },
      });

      res.status(200).json({ success: true, result: voteCount });
    } catch (error) {
      res.status(400).json({ success: false });
    }

    return;
  }

  if (req.method === "PATCH") {
    const userId = req.body.userId as string;

    try {
      if (req.body.type === "UPVOTE") {
        await prisma.reviewLikes.create({
          data: {
            userId,
            reviewId,
          },
        });

        return res.status(200).json({ success: true });
      }

      if (req.body.type === "CANCEL_UPVOTE") {
        await prisma.reviewLikes.delete({
          where: {
            userId_reviewId: {
              userId,
              reviewId,
            },
          },
        });

        return res.status(200).json({ success: true });
      }
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
}
