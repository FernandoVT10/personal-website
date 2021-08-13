import React, { useState } from "react";

import Link from "next/link";

import Carousel from "@/components/Carousel";
import Loader from "@/components/Loader";

import styles from "./ProjectCard.module.scss";

export type IProject = {
  _id: string
  title: string
  images: string[]
}

interface IProjectCardProps {
  project: IProject
  deleteProject: (projectId: string) => Promise<void>
}

const ProjectCard = ({ project, deleteProject }: IProjectCardProps) => {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleOnClick = async () => {
    setConfirming(false);
    setLoading(true);

    try {
      await deleteProject(project._id);
    } catch (err) {
      setErrorMessage(err.message);
    }

    setLoading(false);
  }

  return (
    <div className={styles.projectCard}>
      { loading &&
      <div className={styles.loaderContainer}>
        <Loader/>
        <p className={styles.text}>Deleting the project</p>
      </div>
      }

      { confirming &&
        <div className={styles.confirmMenu}>
          <p className={styles.text}>Are you sure to delete this project?</p>
          <div className={styles.options}>
            <button className={`${styles.option} ${styles.yesOption}`} onClick={handleOnClick}>
              Yes
            </button>

            <button className={`${styles.option} ${styles.noOption}`} onClick={() => setConfirming(false)}>
              No
            </button>
          </div>
        </div>
      }

      <Carousel images={project.images}/>

      <div className={styles.details}>
        <h3 className={styles.title}>{ project.title }</h3>

        <div className={styles.actionButtons}>
          <Link href={`/dashboard/project/${project._id}/edit`}>
            <a className={styles.actionButton}>
              Edit
            </a>
          </Link>

          <a
            href="#"
            onClick={() => setConfirming(true)}
            className={styles.actionButton}
          >
            Delete
          </a>
        </div>
      </div>

      { errorMessage.length > 0 &&
      <p className={styles.errorMessage}>
        <i className="fas fa-times-circle" aria-hidden="true"></i>
        { errorMessage }
      </p>
      }

    </div>
  );
}

export default ProjectCard;
