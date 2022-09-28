import { DefaultResponse } from "./../../../../../apis/types";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import prisma from "../../../../../lib/prisma";

export interface ReviewCountResponse extends DefaultResponse {
  result?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReviewCountResponse>
) {
  const restaurantId = req.query.restaurantId as string;

  if (req.method === "GET") {
    const reviewCount = await prisma.restaurants.findFirst({
      where: {
        id: restaurantId,
      },
      select: {
        _count: {
          select: {
            Reviews: true,
          },
        },
      },
    });

    try {
      res.status(200).json({
        success: true,
        result: reviewCount?._count.Reviews ?? 0,
      });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
}
