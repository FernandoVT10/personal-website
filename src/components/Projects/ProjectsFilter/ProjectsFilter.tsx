import React from "react";

import { ApolloQueryResult } from "@apollo/client";

import { SelectBox } from "@/components/Formulary";

import styles from "./ProjectsFilter.module.scss";

interface TechnologiesResult {
  technologies: { name: string }[]
}

interface ProjectsFilterProps {
  technologiesResult: ApolloQueryResult<TechnologiesResult>
  handleOnSubmit: (e: React.FormEvent) => void
  selectedTechnology: string
  setSelectedTechnology: React.Dispatch<string>
  search: string
  setSearch: React.Dispatch<string>
}

const ProjectsFilter = ({
  technologiesResult,
  handleOnSubmit,
  selectedTechnology,
  setSelectedTechnology,
  search,
  setSearch
}: ProjectsFilterProps) => {
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
