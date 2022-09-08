import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { User } from "@prisma/client";
import { DefaultResponse } from "../../../apis/types";

export interface ProfileResponse extends DefaultResponse {
  result?: User;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ProfileResponse>) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(404).json({ success: false });
    }

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
