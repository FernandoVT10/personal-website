import React from "react";

import Link from "next/link";

import styles from "./ErrorPage.module.scss";

const ErrorPage = ({ statusCode, error }: { statusCode: string, error: string }) => {
  return (
    <div className={styles.errorPage}>
      <h2 className={styles.statusCode}>{ statusCode }</h2>
      <p className={styles.error}>{ error }</p>
      <Link href="/">
        <a className={styles.link}>
          Go to home
        </a>
      </Link>
    </div>
  );
}

export default ErrorPage;
