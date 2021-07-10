import Head from "next/head";

import Login from "@/domain/Dashboard/Login";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Login - Dashboard</title>
      </Head>

      <Login/>
    </>
  );
}

export default LoginPage;
