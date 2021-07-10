import React, { useState } from "react";

import Router from "next/router";

import { gql, useMutation } from "@apollo/client";

import { Input } from "@/components/Formulary";
import Loader from "@/components/Loader";

import styles from "./Login.module.scss";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, { error, loading }] = useMutation(LOGIN);

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await login({
        variables: { username, password }
      }); 

      if(data) {
        localStorage.setItem("token", data.login);
        Router.push("/dashboard");
      }
    } catch { }
  }

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <form onSubmit={handleOnSubmit}>
          <h3 className={styles.title}>Login</h3>

          <Input
            label="Username"
            prefix="username"
            value={username}
            setValue={setUsername}
          />

          <Input
            type="password"
            label="Password"
            prefix="password"
            value={password}
            setValue={setPassword}
          />

          { error &&
          <div className={styles.error}>
            <i className="fas fa-times-circle"></i>
            { error.message }
          </div>
          }

          { !loading ?
            <button type="submit" className={`submit-button ${styles.submitButton}`}>
              Login
            </button>
            :
            <Loader/>
          }
        </form>
      </div>
    </div>
  );
}

export default Login;
