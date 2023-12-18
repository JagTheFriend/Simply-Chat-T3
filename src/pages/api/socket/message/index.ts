import type { NextApiRequest } from "next";
import { db } from "~/server/db";
import type {
  NewMessageData,
  NextApiResponseWithSocketIo,
} from "~/utils/types";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocketIo
) {
  if (req.method == "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    // Creating a message
    if (req.method == "POST") {
      const data = req.body as NewMessageData;
      void db.message.create({
        data: {
          content: data.content,
          receiverId: data.receiverId,
          senderId: data.senderId,
        },
      });
      res?.socket?.server?.io?.emit("newMessage", data);
      res.status(200).json({ message: "New Message Sent" });
    }

    // Deleting a message
    if (req.method == "DELETE") {
    }
  } catch (error) {
    return res.status(500).json({ message: "Interval Server Error" });
  }
}
