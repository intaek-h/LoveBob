import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const restaurantId = req.query.restaurantId as string;
  const userId = req.query.id as string;

  if (req.method === "POST") {
    try {
      await prisma.visitedRestaurants.create({
        data: {
          restaurantsId: restaurantId,
          userId: userId,
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false });
    }

    return;
  }

  if (req.method === "DELETE") {
    try {
      await prisma.visitedRestaurants.delete({
        where: {
          userId_restaurantsId: {
            restaurantsId: restaurantId,
            userId,
          },
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false });
    }

    return;
  }
}