import type { User } from "@prisma/client";
import { useRouter } from "next/router";
import { createContext } from "react";
import UserProfile from "~/components/Profile";
import { api } from "~/utils/api";

const ContactDetailsContext = createContext({} as User);

function SendButton() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-send"
    >
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );
}

function MessageForum() {
  return (
    <div className="fixed-bottom" style={{ margin: "1rem" }}>
      <div className="form-floating input-group">
        <input
          type="text"
          className="form-control"
          id="floatingMessageInput"
          placeholder="Hello World"
        />
        <label
          htmlFor="floatingMessageInput"
          style={{ display: "flex", alignItems: "center" }}
        >
          Enter Message
        </label>
        <button className="btn btn-success" type="button">
          <SendButton />
        </button>
      </div>
    </div>
  );
}

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
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
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
      <MessageForum />
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
