import React, { useEffect, useState } from "react";

import { gql, useLazyQuery } from "@apollo/client";

import Modal from "@/components/Modal";
import Loader from "@/components/Loader";

import CreateTechnology from "./CreateTechnology";
import TechnologiesList from "./TechnologiesList";
import { ITechnology } from "./TechnologiesList/Technology";

import styles from "./ManagementModal.module.scss";

export const GET_TECHNOLOGIES = gql`
  query GetTechnologies {
    technologies {
      _id
      name
    }
  }
`;

interface IManagementModalProps {
  isActive: boolean
  setIsActive: React.Dispatch<boolean>
  selectedTechnologies: string[]
  setSelectedTechnologies: React.Dispatch<React.SetStateAction<string[]>>
}

interface IGetTechnologiesResult {
  technologies: ITechnology[]
}

const ManagementModal = ({
  isActive,
  setIsActive,
  selectedTechnologies,
  setSelectedTechnologies
}: IManagementModalProps) => {
  const [getTechnologies, getTechnologiesResult] = useLazyQuery<IGetTechnologiesResult>(GET_TECHNOLOGIES);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if(isActive && !getTechnologiesResult.called) {
      getTechnologies();
    }
  }, [isActive]);

  const getTechnologiesBySearch = () => {
    const { called, loading } = getTechnologiesResult;
    if(loading || !called) return [];

    const { technologies } = getTechnologiesResult.data;

    if(search.length) {
      return technologies.filter(
        technology => technology.name.toLowerCase().startsWith(search.toLowerCase())
      );
    }

    return technologies;
  }

  const technologies = getTechnologiesBySearch();

  return (
    <Modal isActive={isActive} setIsActive={setIsActive} maxWidth={400} centerModal={true}>
      <div className={styles.management}>
        <input
          type="text"
          placeholder="Search a technology"
          className={styles.searchInput}
          value={search}
          onChange={({ target: { value } }) => setSearch(value)}
          data-testid="search-technology"
        />

        { getTechnologiesResult.loading || !getTechnologiesResult.called ?
          <div className={styles.loaderContainer}>
            <Loader/>
            <p className={styles.text}>Loading technologies</p>
          </div>
          :
          <TechnologiesList
            technologies={technologies}
            selectedTechnologies={selectedTechnologies}
            setSelectedTechnologies={setSelectedTechnologies}
          />
        }

        <CreateTechnology/>
      </div>
    </Modal>
  );
}

export default ManagementModal;
