import Head from "next/head";

import Home from "@/domain/Dashboard/Home";

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Dashboard - Fernando Vaca Tamayo</title>
      </Head>

      <Home/>
    </>
  );
}
