import React, { useEffect, useState } from "react";

import { Actions } from "../reducer";

import ManagementModal from "./ManagementModal";

import styles from "./TechnologiesEditor.module.scss";

interface TechnologiesEditorProps {
  defaultTechnologies: string[]
  dispatch: React.Dispatch<Actions>
}

const TechnologiesEditor = ({ defaultTechnologies, dispatch }: TechnologiesEditorProps) => {
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(defaultTechnologies);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    dispatch({ type: "set-technologies", payload: { technologies: selectedTechnologies} });
  }, [selectedTechnologies]);

  return (
    <div className={styles.technologiesEditor}>
      <ManagementModal
        isActive={isActive}
        setIsActive={setIsActive}
        selectedTechnologies={selectedTechnologies}
        setSelectedTechnologies={setSelectedTechnologies}
      />

      <p className={styles.title}>
        <a className={styles.editButton} onClick={() => setIsActive(true)}>
          Technolgies
          <i className="fas fa-edit" aria-hidden="true"></i>
        </a>
      </p>

      <div className={styles.technologies}>
        {selectedTechnologies.map((technology, index) => {
          return (
            <span className={styles.technology} key={index}>
              { technology }
            </span>
          );
        })}
      </div>

      { selectedTechnologies.length < 1 &&
      <span className={styles.infoMessage}>
        No technologies selected
      </span>
      }
    </div>
  );
}

export default TechnologiesEditor;
