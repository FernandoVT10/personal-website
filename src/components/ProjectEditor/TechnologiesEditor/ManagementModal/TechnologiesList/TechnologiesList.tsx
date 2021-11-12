import React, { useState } from "react";

import { gql, Reference, useMutation } from "@apollo/client";

import Technology, { ITechnology } from "./Technology";

import styles from "./TechnologiesList.module.scss";
import Loader from "@/components/Loader";

export const DELETE_TECHNOLOGY = gql`
  mutation DeleteTechnology($technologyId: ID!) {
    deleteTechnology(technologyId: $technologyId) {
      _id
      name
    }
  }
`;

export const UPDATE_TECHNOLOGY = gql`
  mutation UpdateTechnology($technologyId: ID!, $name: String!) {
    updateTechnology(technologyId: $technologyId, name: $name) {
      _id
      name
    }
  }
`;

interface ITechnologiesListProps {
  technologies: ITechnology[]
  selectedTechnologies: string[]
  setSelectedTechnologies: React.Dispatch<string[]>
}

interface IDeleteTechnologyResult {
  deleteTechnology: ITechnology
}

interface IUpdateTechnologyResult {
  updateTechnology: ITechnology
}

const TechnologiesList = ({ technologies, selectedTechnologies, setSelectedTechnologies }: ITechnologiesListProps) => {
  const [deleteTechnology, deleteTechnologyResult] = useMutation<IDeleteTechnologyResult>(DELETE_TECHNOLOGY, {
    update(cache, { data: { deleteTechnology: deletedTechnology } }) {
      cache.modify({
        fields: {
          technologies(existingTechnologies: Reference[] = [], { readField }) {
            return existingTechnologies.filter(
              technologyRef => deletedTechnology._id !== readField("_id", technologyRef)
            );
          }
        }
      });
    }
  });

  const [updateTechnology, updateTechnologyResult] = useMutation<IUpdateTechnologyResult>(UPDATE_TECHNOLOGY, {
    update(cache, { data: { updateTechnology: updatedTechnology } }) {
      cache.modify({
        fields: {
          technologies(existingTechnologies: Reference[] = [], { readField }) {
            return existingTechnologies.map(technologyRef => {
              if(updatedTechnology._id === readField("_id", technologyRef)) {
                return updatedTechnology;
              }

              return technologyRef;
            });
          }
        }
      });
    }
  });

  const [errorMessage, setErrorMessage] = useState("");

  const toggleTechnology = (technologyName: string) => {
    setErrorMessage("");

    if(selectedTechnologies.includes(technologyName)) {
      return setSelectedTechnologies(
        selectedTechnologies.filter(selectedTechnology => selectedTechnology !== technologyName)
      );
    }

    setSelectedTechnologies([...selectedTechnologies, technologyName]);
  }

  const handleDeleteTechnology = async (technologyId: string) => {
    setErrorMessage("");

    try {
      const result = await deleteTechnology({
        variables: { technologyId: technologyId }
      });

      const deletedTechnology = result.data.deleteTechnology;

      if(selectedTechnologies.includes(deletedTechnology.name)) {
        toggleTechnology(deletedTechnology.name);
      }
    } catch(err) {
      setErrorMessage(err.message);
    }
  }

  const handleEditTechnology = async (technologyId: string, newName: string, oldName: string) => {
    setErrorMessage("");

    try {
      const result = await updateTechnology({
        variables: { technologyId, name: newName }
      });

      const updatedTechnology = result.data.updateTechnology;

      if(selectedTechnologies.includes(oldName)) {
        setSelectedTechnologies(
          selectedTechnologies.map(technologyName => {
            if(technologyName === oldName) {
              return updatedTechnology.name;
            }

            return technologyName;
          })
        );
      } 
    } catch (err) {
      // here we're throwing the error again because we need to show
      // it inside of the technology component
      throw err;
    }
  }

  return (
    <div className={styles.technologiesList}>
      { errorMessage.length > 0 &&
      <p className={styles.errorMessage}>
        { errorMessage }
      </p>
      }

      {(deleteTechnologyResult.loading || updateTechnologyResult.loading) &&
      <div className={styles.loaderContainer}>
        <Loader/>
        <p className={styles.text}>
          { deleteTechnologyResult.loading && "Deleting a technology" }
          { updateTechnologyResult.loading && "Updating a technology" }
        </p>
      </div>
      }

      {technologies.map((technology, index) => {
        const isActive = selectedTechnologies.includes(technology.name);

        return (
          <Technology
            isActive={isActive}
            technology={technology}
            deleteTechnology={handleDeleteTechnology}
            editTechnology={handleEditTechnology}
            toggleTechnology={toggleTechnology}
            key={index}
          />
        );
      })}

      { technologies.length === 0 &&
        <p className={styles.noTechnologiesMessage}>There are no technologies</p>
      }
    </div>
  );
}

export default TechnologiesList;
