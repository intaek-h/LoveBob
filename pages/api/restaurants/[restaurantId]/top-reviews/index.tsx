import { NextApiRequest, NextApiResponse } from "next";
import { DefaultResponse } from "../../../../../apis/types";
import prisma from "../../../../../lib/prisma";

interface Reviews {
  title: string;
  titleLink: string;
  nickname: string | null;
  bobId: string | null;
  preview: string;
  imageUrl: string;
  createdAt: number;
}

export interface TopReviewsResponse extends DefaultResponse {
  result?: Reviews[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TopReviewsResponse>
) {
  const restaurantId = req.query.restaurantId as string;

  if (req.method === "GET") {
    const take = req.query.take as string;
    const skip = req.query.skip as string;

    try {
      const reviews = await prisma.reviews.findMany({
        where: {
          restaurantId,
          NOT: {
            id: skip,
          },
        },
        select: {
          user: {
            select: {
              nickname: true,
              bobId: true,
            },
          },
          ReviewImages: {
            select: {
              urls: true,
            },
          },
          title: true,
          titleLink: true,
          preview: true,
          createdAt: true,
        },
        orderBy: {
          ReviewLikes: {
            _count: "desc",
          },
        },
        take: Number(take) || 3,
      });

      const filteredReviews = reviews.map((review) => ({
        title: review.title,
        titleLink: review.titleLink,
        nickname: review.user.nickname,
        bobId: review.user.bobId,
        preview: review.preview,
        imageUrl: review.ReviewImages[0].urls.split(",")[0],
        createdAt: review.createdAt.getTime(),
      }));

      res.status(200).json({ success: true, result: filteredReviews });
    } catch (error) {
      res.status(400).json({ success: false });
    }

    return;
  }
}
