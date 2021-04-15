import React from "react";

import Link from "next/link";

import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Link href="/">
        <a className={styles.title}>
          Fernando Vaca Tamayo
        </a>
      </Link>

      <div className={styles.socialNetworksContainer}>
        <a href="https://github.com/FernandoVT10" target="_blank" className={styles.socialNetwork}>
          <i className="fab fa-github" aria-hidden="true"></i>
        </a>

        <Link href="/contactme/">
          <a href="#" className={styles.socialNetwork}>
            <i className="fas fa-envelope" aria-hidden="true"></i>
          </a>
        </Link>

        <a href="https://twitter.com/FernandoVT10" target="_blank" className={styles.socialNetwork}>
          <i className="fab fa-twitter" aria-hidden="true"></i>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
