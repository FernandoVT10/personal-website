import Head from "next/head";

import Home from "@/domain/Dashboard/Home";

import withUser from "@/hocs/withUser";

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

export default withUser(DashboardPage, true, "/dashboard/login");
