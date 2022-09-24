import { AddBobIdAndNickNameArgs } from "./../../../../services/ProfileService";
import { checkDuplicateUserIdAndNickNameArgs } from "../../../../services/ProfileService";
import { DefaultResponse } from "../../../../apis/types";
import { Prisma } from "@prisma/client";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import prisma from "../../../../lib/prisma";

export interface OnboardResponse extends DefaultResponse {
  message?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<OnboardResponse>) {
  const { id, bobId, nickname, regions } = req.body as AddBobIdAndNickNameArgs;

  if (!id || !bobId || !nickname) {
    return res.status(400).json({ success: false, message: "잘못된 요청입니다" });
  }

  try {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        nickname,
        bobId,
        regions: regions.join(),
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if ("target" in error.meta! && (error.meta.target as string).includes("userId")) {
        return res.status(400).json({ success: false, message: "중복된 아이디입니다" });
      }

      if ("target" in error.meta! && (error.meta.target as string).includes("nickname")) {
        return res.status(400).json({ success: false, message: "중복된 이름입니다" });
      }
    }

    res.status(400).json({ success: false, message: "잘못된 요청입니다" });
  }
}
