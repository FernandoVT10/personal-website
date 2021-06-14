import React, { useEffect, useState } from "react";

import { gql, useLazyQuery } from "@apollo/client";

import Navbar from "@/components/Navbar";
import ProjectList from "@/components/ProjectList";
import { SelectBox } from "@/components/Formulary";

import getQueryParamsFromURL from "@/utils/getQueryParamsFromURL";

import styles from "./Projects.module.scss";

export const GET_PROJECTS = gql`
  query GetProjects($page: Int) {
    projects(limit: 1, page: $page) {
      docs {
        _id
        title
        description
        images
      }
    }
  }
`;


const Projects = () => {
  const [getProjects, projectsResult] = useLazyQuery(GET_PROJECTS);
  const [search, setSearch] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState("");

  useEffect(() => {
    const query = getQueryParamsFromURL(window.location.search);

    const page = query.page ? parseInt(query.page.toString()) || 0 : 0;

    getProjects({ variables: { page } });
  }, []);

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    projectsResult.refetch({ page: 3 });
  }

  return (
    <div className={styles.projects}>
      <Navbar/>

      <div className={styles.filters}>
        <form onSubmit={handleOnSubmit}>
          <div className={styles.searchInputContainer}>
            <SelectBox
              availableValues={["test 1", "test 2"]}
              currentValue={selectedTechnology}
             setValue={setSelectedTechnology}
            />

            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search a project"
              value={search}
              onChange={({ target: { value } }) => setSearch(value)}
            />

            <button type="submit" className={styles.submitButton}>
              <i className="fas fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </form>
      </div>

      <div className={styles.projectsContainer}>
        { projectsResult.called &&
        <ProjectList projectsResult={projectsResult}/>
        }
      </div>
    </div>
  );
}

export default Projects;
