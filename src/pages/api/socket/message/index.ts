import type { NextApiRequest } from "next";
import { api } from "~/utils/api";
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
      api.message.createMessage.useMutation().mutate({
        content: data.content,
        receiverId: data.receiverId,
      });
      res?.socket?.server?.io?.emit("newMessage", req.body);
      res.status(200).json({ message: "New Message Sent" });
    }

    // Deleting a message
    if (req.method == "DELETE") {
    }
  } catch (error) {
    return res.status(500).json({ message: "Interval Server Error" });
  }
}
