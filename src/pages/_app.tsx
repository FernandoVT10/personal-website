import React from "react";
import Head from "next/head";

import { AppProps } from "next/app";

import { ApolloProvider } from "@apollo/client";

import client from "@/config/apolloClient";

import "@/styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <script src="https://kit.fontawesome.com/10218d85cd.js"></script>
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
