import React from "react";

import { gql, NetworkStatus, useLazyQuery } from "@apollo/client";

import Pagination, { PAGINATION_PROPS } from "@/components/Pagination";
import ProjectsFilter from "@/components/Projects/ProjectsFilter";

import useProjectsFilter, { IVariables } from "@/hooks/useProjectsFilter";

import withUser from "@/hocs/withUser";

import ProjectCardList from "./ProjectCardList";

import styles from "./Home.module.scss";

export const GET_PROJECTS = gql`
  query GetProjects($page: Int, $search: String, $technology: String) {
    projects(limit: 6, page: $page, search: $search, technology: $technology) {
      ${PAGINATION_PROPS}
      docs {
        _id
        title
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

const Home = () => {
  const [getProjects, projectsQueryResult] = useLazyQuery(GET_PROJECTS, { notifyOnNetworkStatusChange: true });
  const [getTechnologies, technologiesQueryResult] = useLazyQuery(GET_TECHNOLOGIES);

  const toTheChangeOfVariables = (newVariables: IVariables) => {
    const { called, loading, refetch } = projectsQueryResult;

    if(!called) {
      getProjects({ variables: newVariables });
      getTechnologies();
    } else if(!loading) refetch(newVariables);
  }

  const refetchProjects = () => {
    projectsQueryResult.refetch();
  }

  const {
    search,
    setSearch,
    selectedTechnology,
    setSelectedTechnology,
    handleOnSubmit
  } = useProjectsFilter(toTheChangeOfVariables);

  const projects = projectsQueryResult.data?.projects.docs;

  return (
    <div className={styles.container}>
      <div className={styles.filtercontainer}>
        <ProjectsFilter
          technologiesResult={technologiesQueryResult}
          handleOnSubmit={handleOnSubmit}
          selectedTechnology={selectedTechnology}
          setSelectedTechnology={setSelectedTechnology}
          search={search}
          setSearch={setSearch}
        />
      </div>

      { projectsQueryResult.called &&
      <ProjectCardList
        loading={projectsQueryResult.loading || projectsQueryResult.networkStatus === NetworkStatus.refetch}
        error={projectsQueryResult.error}
        projects={projects}
        refetchProjects={refetchProjects}
      />
      }

      <div className={styles.paginationContainer}>
        { projectsQueryResult.data &&
          <Pagination data={projectsQueryResult.data.projects}/>
        }
      </div>
    </div>
  );
}

export default withUser(Home, true, "/dashboard/login");
