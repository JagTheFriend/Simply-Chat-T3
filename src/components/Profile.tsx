import { identicon } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import Image from "next/image";

export default function UserProfile({
  username,
  avatar,
}: {
  username: string | null | undefined;
  avatar: string | null | undefined;
}) {
  const generatedAvatar = createAvatar(identicon, {
    seed: username ?? "Unknown",
  });

  return (
    <div style={{ fontSize: "21px" }}>
      <Image
        alt="Avatar"
        className="avatar avatar-48 bg-light rounded-circle text-white p-2"
        src={avatar ?? generatedAvatar.toDataUriSync()}
        style={{ marginLeft: "0.5rem" }}
        width={"100"}
        height={"100"}
      />{" "}
      {username ?? "Unknown"}
    </div>
  );
}
