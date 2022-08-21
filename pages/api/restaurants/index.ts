import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { x, y } = req.query;

    const restaurants = await prisma.$queryRaw`
      select id, poi_nm as name, branch_nm as subName, rd_nm as road, bld_num as building_number, ST_X(loc) as x, ST_Y(loc) as y, sido_nm, sgg_nm 
      from restaurants
      where ST_Distance(restaurants.loc, ST_SRID(POINT(${x}, ${y}), 4326)) < 300;
  `;

    return res.status(200).json({ success: true, result: restaurants });
  }
}
