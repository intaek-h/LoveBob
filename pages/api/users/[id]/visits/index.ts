import { DefaultResponse } from "../../../../../apis/types";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";

export interface Restaurant {
  name: string;
  city: string;
  roadAddress: string;
  category: string | null;
  posts: number;
  id: string;
  addedDate: number;
  isFavorite: boolean;
}

export interface VisitedRestaurantResponse extends DefaultResponse {
  result?: Restaurant[];
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

    const filteredVisitedRestaurants = visits.map((record) => ({
      name: `${record.restaurant.poi_nm} ${record.restaurant.branch_nm} ${record.restaurant.sub_nm}`,
      city: `${record.restaurant.sido_nm} ${record.restaurant.sgg_nm}`,
      roadAddress: `${record.restaurant.rd_nm} ${record.restaurant.bld_num}`,
      category: record.restaurant.mcate_nm,
      posts: record.restaurant._count.Reviews,
      id: record.restaurantId,
      addedDate: record.createdAt.getTime(),
      isFavorite: record.isFavorite,
    }));

    res.status(200).json({ success: true, result: filteredVisitedRestaurants });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
