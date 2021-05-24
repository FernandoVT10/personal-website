import React from "react";

import { ApolloQueryResult } from "@apollo/client";

import Link from "next/link";

import Footer from "@/components/Footer";

import ProjectList, { ProjectsData } from "./ProjectList";
import ContactMe from "./ContactMe";

import styles from "./Home.module.scss";

const Home = ({ projectsResult }: { projectsResult: ApolloQueryResult<ProjectsData> }) => {
  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <header className={styles.header}>
          <div className={styles.navbar}>
            <ul className={styles.items}>
              <li className={styles.item}>
                <Link href="/">
                  <a className={styles.link}>Home</a>
                </Link>
              </li>

              <li className={styles.item}>
                <Link href="/projects/">
                  <a className={styles.link}>My Projects</a>
                </Link>
              </li>

              <li className={styles.item}>
                <Link href="/contactme/">
                  <a className={styles.link}>Contact Me</a>
                </Link>
              </li>
            </ul>
          </div>
        </header>

        <div className={styles.profile}>
          <div className={styles.picture}>
            <img
              className={styles.image}
              src="/img/profile-picture.jpg"
              alt="Profile Picture"
            />
          </div>

          <h1 className={styles.fullName}>
            Fernando Vaca Tamayo
          </h1>

          <p className={styles.description}>
            Ipsum beatae illo porro odio voluptatum. Exercitationem temporibus animi cum a similique reprehenderit? Id error odio dolore sapiente quaerat, alias? Incidunt exercitationem eius quibusdam deserunt consectetur Adipisci tenetur earum rem odio maiores Obcaecati voluptatibus maiores minus dignissimos iste Vitae beatae magni alias ad culpa inventore modi Quo ipsum dicta odio
          </p>
        </div>
      </div>

      <h2 className={styles.subtitle}>My Projects</h2>

      <ProjectList projectsResult={projectsResult}/>

      <div className={styles.contactMe}>
        <ContactMe/>
      </div>

      <Footer/>
    </div>
  );
}

export default Home;
