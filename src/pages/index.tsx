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

export default function Home() {
  return (
    <>
      <Metadata />
      <Navbar />
    </>
  );
}
