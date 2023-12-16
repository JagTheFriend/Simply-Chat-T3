import type { NextApiRequest } from "next";
import type { NextApiResponseServerIo } from "./io";

interface BodyType {
  content: string;
  senderId: string;
  receiverId: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method === "POST") {
    const { content, senderId, receiverId } = req.body as BodyType;
    res?.socket?.server?.io?.emit("create", {
      data: { content, senderId, receiverId },
    });
  }

  return res.status(200).json("message");
}
