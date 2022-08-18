import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { Prisma } from "@prisma/client";

type Data = {
  id: string;
  name: string;
  email: string;
  emailVerified?: string;
  image?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) throw ""; // 미들웨어에서 처리할테니까 없애도 됨.

    const user = await prisma.user.findFirst({
      where: {
        email: session.user!.email!,
      },
    });

    if (user) {
      return res.status(200).json({ success: true, result: user });
    }

    res.status(404).json({ success: false });
  } catch (error) {
    res.status(404).json({ success: false });
  }
}
