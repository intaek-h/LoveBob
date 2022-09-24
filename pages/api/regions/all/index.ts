import { DefaultResponse } from "./../../../../apis/types";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import prisma from "../../../../lib/prisma";
import { Regions } from "@prisma/client";

export interface RegionsResponse extends DefaultResponse {
  result?: Regions[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<RegionsResponse>) {
  try {
    const regions = await prisma.regions.findMany();

    res.status(200).json({
      success: true,
      result: regions,
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
