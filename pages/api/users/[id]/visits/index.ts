import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.id as string;

  try {
    const visits = await prisma.visitedRestaurants.findMany({
      where: {
        userId,
      },
    });

    const result: {
      [restaurantId: string]: boolean;
    } = {};

    visits.forEach((visit) => {
      result[visit.restaurantsId] = true;
    });

    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
