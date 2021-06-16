import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { gql, useLazyQuery } from "@apollo/client";

import Navbar from "@/components/Navbar";
import { SelectBox } from "@/components/Formulary";
import ProjectList from "@/components/ProjectList";
import Pagination, { PAGINATION_FRAGMENT } from "@/components/Pagination";

import styles from "./Projects.module.scss";

export const GET_PROJECTS = gql`
  ${PAGINATION_FRAGMENT}

  query GetProjects($page: Int, $search: String) {
    projects(limit: 1, page: $page, search: $search) {
      ...PaginationProps
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
  const [search, setSearch] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState("");

  const [getProjects, projectsResult] = useLazyQuery(GET_PROJECTS);

  const router = useRouter();

  const getVariables = (): { page: number, search: string, technology: string } => {
    const query = new URLSearchParams(window.location.search);

    const page = query.get("page") ? parseInt(query.get("page")) || 0 : 0;
    const search = query.get("search") ?? "";
    const technology = query.get("technology") ?? "";

    return { page, search, technology }
  }

  useEffect(() => {
    getProjects({ variables: getVariables() });
  }, []);

  useEffect(() => {
    const variables = getVariables();

    // if the query has been called and isn't loading, we're going to refetch the data with the new variables
    if(projectsResult.called && !projectsResult.loading) {
      projectsResult.refetch(variables);
    }

    setSearch(variables.search);
    setSelectedTechnology(variables.technology);
  }, [router.query]);

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const query: { [key: string]: string } = {}

    if(search) query.search = search;
    if(selectedTechnology) query.technology = selectedTechnology;

    router.push({
      pathname: router.pathname,
      query
    });
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

      { projectsResult.called &&
      <ProjectList projectsResult={projectsResult}/>
      }

      { projectsResult.data &&
      <div className={styles.pagination}>
        <Pagination data={projectsResult.data.projects}/>
      </div>
      }
    </div>
  );
}

export default Projects;
