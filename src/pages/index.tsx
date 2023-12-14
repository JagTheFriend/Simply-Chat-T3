import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { AddNewContact, DisplayContactsList } from "~/components/Contact";
import Navbar from "~/components/Navbar";

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
        fontSize: "19px",
        paddingTop: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {currentSessionData ? (
        <>
          Welcome
          <Image
            alt="Avatar"
            className="avatar avatar-48 bg-light rounded-circle text-white p-2"
            src={currentSessionData?.user.image ?? ""}
            style={{ marginLeft: "0.5rem" }}
          />{" "}
          {currentSessionData.user.name}!
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
