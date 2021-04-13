import React from "react";

import Head from 'next/head'

import Home from "@/domain/Home";

export default function HomePage() {
  return (
    <div>
      <Head>
        <title>Fernando Vaca Tamayo</title>
      </Head>

      <Home/>
    </div>
  )
}
