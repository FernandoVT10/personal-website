import Head from "next/head";

import Home from "@/domain/Dashboard/Home";

function DashboardPage() {
  return (
    <>
      <Head>
        <title>Home - Dashboard</title>
      </Head>

      <Home/>
    </>
  );
}

export default DashboardPage;
