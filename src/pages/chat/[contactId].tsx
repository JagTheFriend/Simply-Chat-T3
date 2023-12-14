import type { User } from "@prisma/client";
import { useRouter } from "next/router";
import { createContext } from "react";
import UserProfile from "~/components/Profile";
import { api } from "~/utils/api";

const ContactDetailsContext = createContext({} as User);

function GoBack() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="feather feather-arrow-left"
      >
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    </>
  );
}

function LoadUserData({ contactId }: { contactId: string }) {
  const { data, isError } = api.user.findUserById.useQuery(
    {
      userId: contactId,
    },
    {
      refetchInterval: 1000 * 60 * 4,
      refetchIntervalInBackground: true,
      refetchOnReconnect: true,
    }
  );
  if (isError || !data) return <>{"Unable to load contact's details"}</>;

  return (
    <ContactDetailsContext.Provider value={data}>
      <div
        style={{ display: "flex", alignItems: "center", paddingTop: "1rem" }}
      >
        <GoBack />
        <UserProfile username={data.name} avatar={data.image} />
      </div>
      <hr />
    </ContactDetailsContext.Provider>
  );
}

export default function Chat() {
  const router = useRouter();
  const contactId = router.query.contactId as string;

  if (!contactId) return <>{"Provide a valid contact ID"}</>;

  return (
    <div className="container" style={{ fontSize: "21px" }}>
      <LoadUserData contactId={contactId} />
    </div>
  );
}
