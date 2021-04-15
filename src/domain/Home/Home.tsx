import React from "react";

import Link from "next/link";

import Footer from "@/components/Footer";

import ProjectCard from "./ProjectCard";
import ContactMe from "./ContactMe";

import styles from "./Home.module.scss";

const projectCardsMock = [
  {
    _id: "testid",
    title: "test title",
    description: "Ipsum quasi nobis numquam nesciunt corporis inventore Cum alias sint suscipit consequuntur fugit, dolor Necessitatibus mollitia qui aliquid aspernatur ea placeat similique Quos alias voluptatibus voluptas possimus debitis Dolor officiis officiis cupiditate dignissimos delectus quis, obcaecati Libero incidunt maiores sequi dolores quasi! Quidem vel architecto in delectus alias Quia commodi",
    images: [
      "/img/test-image.jpg",
      "/img/test-image-2.jpg"
    ]
  },
  {
    _id: "testid",
    title: "test title",
    description: "Ipsum quasi nobis numquam nesciunt corporis inventore Cum alias sint suscipit consequuntur fugit, dolor Necessitatibus mollitia qui aliquid aspernatur ea placeat similique Quos alias voluptatibus voluptas possimus debitis Dolor officiis officiis cupiditate dignissimos delectus quis, obcaecati Libero incidunt maiores sequi dolores quasi! Quidem vel architecto in delectus alias Quia commodi",
    images: [
      "/img/test-image-2.jpg",
      "/img/test-image.jpg"
    ]
  }
];

const Home = () => {
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

      <div className={styles.projectsContainer}>
        {projectCardsMock.map((project, index) => {
          return (
            <div className={styles.projectCard} key={index}>
              <ProjectCard project={project} />
            </div>
          );
        })}
      </div>

      <div className={styles.contactMe}>
        <ContactMe/>
      </div>

      <Footer/>
    </div>
  );
}

export default Home;
