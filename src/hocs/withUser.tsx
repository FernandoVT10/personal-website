import React,{ ComponentType, useEffect, useState } from "react";

import { gql } from "@apollo/client";

import Router from "next/router";

import FullScreenLoader from "@/components/FullScreenLoader";

import apolloClient from "@/config/apolloClient";

export const CHECK_LOGIN_STATUS = gql`
  query CheckLoginStatus {
    checkLoginStatus
  }
`;

interface IHOCProps {
  [key: string]: any
}

const withUser = (
  WrappedComponent: ComponentType<IHOCProps>, protectedRoute: boolean, redirectTo: string
) => (props: IHOCProps) => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const result = await apolloClient.query({
        query: CHECK_LOGIN_STATUS, fetchPolicy: "no-cache"
      });

      if(!result.data.checkLoginStatus && protectedRoute) {
        return Router.push(redirectTo);
      }

      setLoggedIn(result.data.checkLoginStatus);
      setLoading(false);
    }

    checkLoginStatus();
  }, []);

  if(loading) return <FullScreenLoader message="Logging in"/>;

  return <WrappedComponent loggedIn={loggedIn} {...props} />;
}

export default withUser;
