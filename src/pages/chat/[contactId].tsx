import type { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import UserProfile from "~/components/Profile";
import { SocketProvider } from "~/components/Proviers/SocketProvider";
import { api } from "~/utils/api";

const ContactDetailsContext = createContext({} as User);

function DisplayMessages() {
  return <></>;
}

function SendButton({
  messageContent,
  setMessageContent,
}: {
  messageContent: string;
  setMessageContent: (value: string) => void;
}) {
  const contactDetails = useContext(ContactDetailsContext);
  const { mutate } = api.message.createMessage.useMutation({
    onError: () => {
      alert("An Error occurred while sending message");
    },
    onSuccess: () => {
      setMessageContent("");
    },
  });

  return (
    <button
      className="btn btn-success"
      type="button"
      disabled={!messageContent}
      onClick={() =>
        mutate({
          content: messageContent,
          receiverId: contactDetails.id,
        })
      }
    >
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
    </button>
  );
}

function MessageForum() {
  const [messageContent, setMessageContent] = useState("");

  return (
    <div className="fixed-bottom" style={{ margin: "1rem" }}>
      <div className="input-group">
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="messageInputForm"
            placeholder="Hello World"
            onChange={(e) => setMessageContent(e.target.value)}
          />
          <label htmlFor="messageInputForm">Send Message</label>
        </div>
        <SendButton
          messageContent={messageContent}
          setMessageContent={setMessageContent}
        />
      </div>
    </div>
  );
}

function GoBack() {
  return (
    <Link href={"/"} shallow={true}>
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
    </Link>
  );
}

function LoadUserData({ contactData }: { contactData: User }) {
  if (!contactData) return <>{"Unable to load contact's details"}</>;

  return (
    <div style={{ display: "flex", alignItems: "center", paddingTop: "1rem" }}>
      <GoBack />
      <UserProfile username={contactData.name} avatar={contactData.image} />
    </div>
  );
}

export default function Chat() {
  const router = useRouter();
  const { query } = router;
  const contactData = JSON.parse((query.data as string) ?? "{}") as User;

  useEffect(() => {
    // Remove all the query params and
    // Display username rather than userId
    window.history.replaceState(null, "", `/chat/${contactData.name}`);
  }, []);

  if (!contactData) return <>{"Provide a valid contact ID"}</>;

  return (
    <div className="container" style={{ fontSize: "21px" }}>
      <SocketProvider>
        <ContactDetailsContext.Provider value={contactData}>
          <LoadUserData contactData={contactData} />
          <hr />
          <MessageForum />
        </ContactDetailsContext.Provider>
        <DisplayMessages />
      </SocketProvider>
    </div>
  );
}
