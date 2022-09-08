import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import AWS from "aws-sdk";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { DefaultResponse } from "../../../../apis/types";
import { v4 as uuid } from "uuid";

interface Queries {
  [key: string]: string;
}

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<DefaultResponse>) {
  if (!req.query.id) {
    return res.status(400).json({ success: false });
  }

  const id = req.query.id as string;

  // if (req.method === "POST" && req.body.type === "visited-restaurant") {
  //   try {
  //     const restaurantId = req.body.id;

  //     await prisma.visitedRestaurants.create({
  //       data: {
  //         restaurantId,
  //         userId: id,
  //       },
  //     });

  //     res.status(200).json({ success: true });
  //   } catch (error) {
  //     res.status(400).json({ success: false });
  //   }

  //   return;
  // }

  if (req.method === "PUT" && req.body.type === "description") {
    try {
      const queries: Queries = {};

      for (const [key, value] of Object.entries(req.body)) {
        if (key === "type" || !value) continue;

        queries[key] = value as string;
      }

      await prisma.user.update({
        where: {
          id,
        },
        data: queries,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false });
    }

    return;
  }

  if (req.method === "PUT" && req.body.type === "image") {
    try {
      const session = await unstable_getServerSession(req, res, authOptions);

      if (!session || !session.user) return res.status(400).json({ success: false });

      const { image } = req.body;

      const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64");

      const { Location: S3_Location } = await s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME as string,
          Key: `${uuid()}.webp`,
          Body: imageBuffer,
          ContentEncoding: "base64",
          ContentType: "image/webp",
        })
        .promise();

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          image: S3_Location,
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false });
    }

    return;
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "2mb",
    },
  },
};
