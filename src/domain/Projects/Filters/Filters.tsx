import React from "react";

import { ApolloQueryResult } from "@apollo/client";

import { SelectBox } from "@/components/Formulary";

import styles from "./Filters.module.scss";

interface TechnologiesResult {
  technologies: { name: string }[]
}

interface FiltersProps {
  technologiesResult: ApolloQueryResult<TechnologiesResult>
  handleOnSubmit: (e: React.FormEvent) => void
  selectedTechnology: string
  setSelectedTechnology: React.Dispatch<string>
  search: string
  setSearch: React.Dispatch<string>
}

const Filter = ({
  technologiesResult,
  handleOnSubmit,
  selectedTechnology,
  setSelectedTechnology,
  search,
  setSearch
}: FiltersProps) => {
  const technologies = technologiesResult.data
    ? technologiesResult.data.technologies.map(technology => technology.name)
    : [];

  return (
    <div className={styles.filters}>
      <form onSubmit={handleOnSubmit} data-testid="filters-form">
        <div className={styles.searchInputContainer}>
          <SelectBox
            label="Select a technology"
            availableValues={technologies}
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
  );
}

export default Filter;
