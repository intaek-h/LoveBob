import { DefaultResponse } from "./../../../../../apis/types";
import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import shuffleArray from "../../../../../utils/shuffleArray";

interface Coords {
  x: number;
  y: number;
}

interface Restaurants {
  id: string;
  name: string;
  subName: string;
  road: string;
  building_number: string;
  sido_nm: string;
  sgg_nm: string;
  reviewCount: BigInt;
  category: string;
}

interface Result extends Omit<Restaurants, "reviewCount"> {
  reviewCount: number;
}

export interface NearbyRestaurantsOfRestaurantResponse extends DefaultResponse {
  result?: Result[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NearbyRestaurantsOfRestaurantResponse>
) {
  const restaurantId = req.query.restaurantId as string;

  if (req.method === "GET") {
    try {
      const coords = await prisma.$queryRaw<Coords[]>`
        select ST_X(res.loc) as x, ST_Y(res.loc) as y
        from restaurants as res
        where res.id = ${restaurantId}
        limit 1;
      `;

      const restaurants = await prisma.$queryRaw<Restaurants[]>`
        select 
          res.id, 
          res.poi_nm as name, 
          res.branch_nm as subName, 
          res.rd_nm as road, 
          res.bld_num as building_number, 
          res.sido_nm, 
          res.sgg_nm, 
          res.mcate_nm as category, 
          count(rev.id) as reviewCount
        from restaurants as res
        left join reviews as rev
          on rev.restaurantId = res.id
        where 
          ST_Distance(res.loc, ST_SRID(POINT(${coords[0].y}, ${coords[0].x}), 4326)) < 300
          and
          res.id != ${restaurantId}
        group by res.id
        order by reviewCount desc
        limit 15;
      `;

      const shuffledRestaurants = shuffleArray(restaurants)
        .slice(0, 5)
        .map((res) => ({
          ...res,
          reviewCount: Number(res.reviewCount),
        }));

      res.status(200).json({ success: true, result: shuffledRestaurants });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
}
