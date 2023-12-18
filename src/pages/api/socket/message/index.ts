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
      const { mutate } = api.message.createMessage.useMutation({
        onSuccess(data, _variables, _context) {
          res?.socket?.server?.io?.emit("newMessage", data);
          res.status(200).json({ message: "New Message Sent" });
        },
        onError: () => {
          res.status(500).json({ message: "Interval Server Error" });
        },
      });
      mutate({
        content: data.content,
        receiverId: data.receiverId,
      });
    }

    // Deleting a message
    if (req.method == "DELETE") {
    }
  } catch (error) {
    return res.status(500).json({ message: "Interval Server Error" });
  }
}
