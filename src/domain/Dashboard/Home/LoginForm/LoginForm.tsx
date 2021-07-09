import React, { useState } from "react";

import { Input } from "@/components/Formulary";

import styles from "./LoginForm.module.scss";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <form>
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

          <div className={styles.error}>
            <i className="fas fa-times-circle"></i>
            Error Message
          </div>

          <button type="submit" className={`submit-button ${styles.submitButton}`}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
