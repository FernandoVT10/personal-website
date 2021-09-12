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
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" />
        <link rel="icon" type="image/svg" href="/img/favicon.svg" />
        </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
