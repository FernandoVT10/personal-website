import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { gql, useLazyQuery } from "@apollo/client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectList from "@/components/Projects/ProjectList";
import Pagination, { PAGINATION_PROPS } from "@/components/Pagination";

import Filters from "@/components/Projects/ProjectsFilter";

import styles from "./Projects.module.scss";

export const GET_PROJECTS = gql`
  query GetProjects($page: Int, $search: String, $technology: String) {
    projects(limit: 3, page: $page, search: $search, technology: $technology) {
      ${PAGINATION_PROPS}
      docs {
        _id
        title
        description
        images
      }
    }
  }
`;

export const GET_TECHNOLOGIES = gql`
  query GetTechnologies {
    technologies {
      name
    }
  }
`;

const getVariables = (): { page: number, search: string, technology: string } => {
  const query = new URLSearchParams(window.location.search);

  const page = query.get("page") ? parseInt(query.get("page")) || 0 : 0;
  const search = query.get("search") ?? "";
  const technology = query.get("technology") ?? "";

  return { page, search, technology }
}

const Projects = () => {
  const [search, setSearch] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState("");

  const [getProjects, projectsResult] = useLazyQuery(GET_PROJECTS);
  const [getTechnologies, technologiesResult] = useLazyQuery(GET_TECHNOLOGIES);

  const router = useRouter();

  useEffect(() => {
    getProjects({ variables: getVariables() });
    getTechnologies();
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

      <div className="body">
        <div className={styles.filters}>
          <Filters
            technologiesResult={technologiesResult}
            handleOnSubmit={handleOnSubmit}
            selectedTechnology={selectedTechnology}
            setSelectedTechnology={setSelectedTechnology}
            search={search}
            setSearch={setSearch}
          />
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

        <Footer/>
    </div>
  );
}

export default Projects;
