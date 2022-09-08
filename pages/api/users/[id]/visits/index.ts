import { DefaultResponse } from "./../../../../../apis/types";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";

export interface Restaurant {
  poi_nm: string;
  branch_nm: string | null;
  sub_nm: string | null;
  sido_nm: string | null;
  sgg_nm: string | null;
  rd_nm: string | null;
  bld_num: string | null;
  mcate_nm: string | null;
  _count: {
    Reviews: number;
  };
}

interface VisitedRestaurant {
  userId: string;
  restaurantId: string;
  restaurant: Restaurant;
}

export interface VisitedRestaurantResponse extends DefaultResponse {
  result?: VisitedRestaurant[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VisitedRestaurantResponse>
) {
  const userId = req.query.id as string;

  try {
    const visits = await prisma.visitedRestaurants.findMany({
      where: {
        userId,
      },
      include: {
        restaurant: {
          select: {
            _count: {
              select: { Reviews: true },
            },
            poi_nm: true,
            branch_nm: true,
            sub_nm: true,
            sido_nm: true,
            sgg_nm: true,
            rd_nm: true,
            bld_num: true,
            mcate_nm: true,
          },
        },
      },
    });

    res.status(200).json({ success: true, result: visits });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
