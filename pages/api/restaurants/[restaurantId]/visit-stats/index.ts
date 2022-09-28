import { DefaultResponse } from "./../../../../../apis/types";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import prisma from "../../../../../lib/prisma";

export interface VisitStatsResponse extends DefaultResponse {
  result?: {
    visitCount: number;
    favCount: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VisitStatsResponse>
) {
  const restaurantId = req.query.restaurantId as string;

  if (req.method === "GET") {
    const visitedRestaurantCountPromise = prisma.restaurants.findFirst({
      where: {
        id: restaurantId,
      },
      include: {
        _count: {
          select: {
            VisitedRestaurants: true,
          },
        },
      },
    });

    const favoriteRestaurantCountPromise = prisma.restaurants.findFirst({
      where: {
        id: restaurantId,
      },
      include: {
        _count: {
          select: {
            VisitedRestaurants: {
              where: {
                isFavorite: {
                  equals: true,
                },
              },
            },
          },
        },
      },
    });

    try {
      const [visitedRestaurantCount, favoriteRestaurantCount] = await Promise.all([
        visitedRestaurantCountPromise,
        favoriteRestaurantCountPromise,
      ]);

      res.status(200).json({
        success: true,
        result: {
          visitCount: visitedRestaurantCount?._count.VisitedRestaurants ?? 0,
          favCount: favoriteRestaurantCount?._count.VisitedRestaurants ?? 0,
        },
      });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
}
