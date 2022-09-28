import { DefaultResponse } from "../../../../../../apis/types";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../../lib/prisma";

export interface MyReviewVoteResponse extends DefaultResponse {
  result?: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MyReviewVoteResponse>
) {
  const reviewId = req.query.reviewId as string;
  const userId = req.body.userId as string;

  if (req.method === "POST") {
    try {
      const voteCount = await prisma.reviewLikes.findFirst({
        where: {
          AND: [
            {
              userId,
            },
            {
              reviewId,
            },
          ],
        },
      });

      res.status(200).json({ success: true, result: !!voteCount });
    } catch (error) {
      res.status(400).json({ success: false });
    }

    return;
  }
}
