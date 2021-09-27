import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { ApolloQueryResult } from "@apollo/client";

import { SelectBox } from "@/components/Formulary";

import styles from "./ProjectsFilter.module.scss";

export type IVariables = {
  page: number
  search: string
  technology: string
}

export const getVariables = (): IVariables => {
  const query = new URLSearchParams(window.location.search);

  const page = query.get("page") ? parseInt(query.get("page")) || 0 : 0;
  const search = query.get("search") ?? "";
  const technology = query.get("technology") ?? "";

  return { page, search, technology }
}

type ITechnology = {
  name: string
}

interface ProjectsFilterProps {
  technologiesResult: ApolloQueryResult<{ technologies: ITechnology[] }>
  toTheChangeOfVariables: (newVariables: IVariables) => void
}

const ProjectsFilter = ({
  technologiesResult,
  toTheChangeOfVariables
}: ProjectsFilterProps) => {
  const [search, setSearch] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState("");

  const router = useRouter();

  useEffect(() => {
    const variables = getVariables();

    toTheChangeOfVariables(variables);

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

  const technologies = technologiesResult.data
    ? technologiesResult.data.technologies.map(technology => technology.name)
    : [];

  return (
    <form onSubmit={handleOnSubmit} data-testid="filters-form">
      <div className={styles.projectsFilter}>
        <div className={styles.selectBoxContainer}>
          <SelectBox
            label="Select a technology"
            availableValues={technologies}
            currentValue={selectedTechnology}
            setValue={setSelectedTechnology}
          />
        </div>

        <div className={styles.searchInputContainer}>

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
      </div>
    </form>
  );
}

export default ProjectsFilter;
