import Head from "next/head";
import Navbar from "~/components/Navbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Simply Chat</title>
        <meta
          name="description"
          content="A Simple Chat App created using create-t3-app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
    </>
  );
}
