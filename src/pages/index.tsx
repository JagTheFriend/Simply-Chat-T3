/* eslint-disable @next/next/no-img-element */
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";

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
          <img
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

function DisplayContactsList() {
  const { data } = useSession();
  if (!data) return <></>;

  const { data: contactData, isError } = api.contact.getContacts.useQuery();

  if (isError) return <>An Error occurred while loading all contacts</>;

  return (
    <ul className="list-group">
      {contactData?.map((contact) => {
        const { data: userData, isError: fetchError } =
          api.user.findUser.useQuery({
            userId: contact.contactId,
          });
        if (fetchError)
          return <li className="list-group-item">Unable to load info</li>;
        return (
          <li className="list-group-item">
            <img
              alt="Avatar"
              className="avatar avatar-48 bg-light rounded-circle text-white p-2"
              src={userData?.image ?? ""}
              // style={{ marginLeft: "0.5rem" }}
            />
            {userData?.name ?? "Unknown"}
          </li>
        );
      })}
    </ul>
  );
}

export default function Home() {
  return (
    <>
      <Metadata />
      <Navbar />
      <DisplayUsername />
      <DisplayContactsList />
      <hr />
    </>
  );
}
