import React from "react";

import { gql, useLazyQuery } from "@apollo/client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectList from "@/components/Projects/ProjectList";
import Pagination, { PAGINATION_PROPS } from "@/components/Pagination";
import Filters from "@/components/Projects/ProjectsFilter";

import useProjectsFilter, { IVariables } from "@/hooks/useProjectsFilter";

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

const Projects = () => {
  const [getProjects, projectsResult] = useLazyQuery(GET_PROJECTS);
  const [getTechnologies, technologiesResult] = useLazyQuery(GET_TECHNOLOGIES);

  const toTheChangeOfVariables = (newVariables: IVariables) => {
    if(!projectsResult.called) {
      getProjects({ variables: newVariables });
      getTechnologies();
    }

    if(projectsResult.called && !projectsResult.loading) {
      projectsResult.refetch(newVariables);
    }
  }

  const {
    search,
    setSearch,
    selectedTechnology,
    setSelectedTechnology,
    handleOnSubmit
  } = useProjectsFilter(toTheChangeOfVariables);

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
