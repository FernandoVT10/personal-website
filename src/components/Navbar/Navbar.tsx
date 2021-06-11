import React, { useState } from "react";

import Link from "next/link";

import styles from "./Navbar.module.scss";

const Navbar = () => {
  const [navbarActive, setNavbarActive] = useState(false);

  const menuClassName = navbarActive ? styles.active : "";

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <a className={styles.link}>
            <img
              src="/img/profile-picture.jpg"
              className={styles.image}
              alt="Profile Picture"
            />

            <h3 className={styles.name}>Fernando Vaca Tamayo</h3>
          </a>
        </Link>
      </div>

      <div className={`${styles.menu} ${menuClassName}`}>
        <ul className={styles.menuItems}>
          <li className={styles.menuItem}>
            <Link href="/">
              <a className={styles.link}>Home</a>
            </Link>
          </li>

          <li className={styles.menuItem}>
            <Link href="/projects/">
              <a className={styles.link}>My Projects</a>
            </Link>
          </li>

          <li className={styles.menuItem}>
            <Link href="/contactme/">
              <a className={styles.link}>Contact Me</a>
            </Link>
          </li>
        </ul>
      </div>

      <button
        className={styles.toggleButton}
        onClick={() => setNavbarActive(!navbarActive)}
      >
        <i className="fas fa-bars" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default Navbar;
