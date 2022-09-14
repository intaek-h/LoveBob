import { DefaultResponse } from "../../../../../apis/types";
import { checkDuplicateUserIdAndNickNameArgs } from "../../../../../services/ProfileService";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import prisma from "../../../../../lib/prisma";

export interface OnboardResponse extends DefaultResponse {
  message?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<OnboardResponse>) {
  const { bobId, nickname } = req.query as Partial<checkDuplicateUserIdAndNickNameArgs>;

  if (!bobId || !nickname) {
    return res.status(400).json({ success: false, message: "잘못된 요청입니다" });
  }

  try {
    const duplicateNickname = await prisma.user.findFirst({
      where: {
        nickname,
      },
    });

    if (duplicateNickname) {
      return res.status(400).json({ success: false, message: "중복된 이름입니다" });
    }

    const duplicateBobId = await prisma.user.findFirst({
      where: {
        bobId,
      },
    });

    if (duplicateBobId) {
      return res.status(400).json({ success: false, message: "중복된 아이디입니다" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: "잘못된 요청입니다" });
  }
}
