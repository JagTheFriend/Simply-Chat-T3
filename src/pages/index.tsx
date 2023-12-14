import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { DisplayContactsList } from "~/components/Contact/DisplayContacts";
import { AddNewContact } from "~/components/Contact/Modal";
import Navbar from "~/components/Navbar";
import UserProfile from "~/components/Profile";

function Metadata() {
  return (
    <Head>
      <title>Simply Chat</title>
      <meta
        name="description"
        content="A Simple Chat App created using create-t3-app"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}

function DisplayUsername() {
  const { data: currentSessionData } = useSession();
  return (
    <div
      style={{
        fontSize: "21px",
        paddingTop: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {currentSessionData ? (
        <>
          Welcome
          <UserProfile
            avatar={currentSessionData.user.image}
            username={currentSessionData.user.name}
          />
          !
        </>
      ) : (
        <button className="btn btn-primary" onClick={() => void signIn()}>
          Login To Continue!
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const { data } = useSession();

  return (
    <>
      <Metadata />
      <Navbar />
      <DisplayUsername />
      <hr />
      {data && (
        <>
          <DisplayContactsList />
          <AddNewContact />
        </>
      )}
    </>
  );
}
