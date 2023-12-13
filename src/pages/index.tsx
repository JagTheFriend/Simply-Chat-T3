import { useSession } from "next-auth/react";
import Head from "next/head";
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
      }}
    >
      Welcome {currentSessionData?.user?.name}!
      <img
        alt="Avatar"
        className="avatar avatar-48 bg-light rounded-circle text-white p-2"
        src={currentSessionData?.user.image ?? ""}
      />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Metadata />
      <Navbar />
      <DisplayUsername />
      <hr />
    </>
  );
}
