import type { NextApiRequest } from "next";
import type { NextApiResponseWithSocketIo } from "~/utils/types";

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
      console.log(req.body);
    }

    // Deleting a message
    if (req.method == "DELETE") {
    }
  } catch (error) {
    return res.status(500).json({ message: "Interval Server Error" });
  }
}
