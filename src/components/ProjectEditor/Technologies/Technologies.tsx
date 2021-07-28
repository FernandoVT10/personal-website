import React, { useState } from "react";

import ManagementModal from "./ManagementModal";

import styles from "./Technologies.module.scss";

interface ITechnoligiesProps {
  selectedTechnologies: string[]
  setSelectedTechnologies: React.Dispatch<React.SetStateAction<string[]>>
}

const Technologies = ({ selectedTechnologies, setSelectedTechnologies }: ITechnoligiesProps) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={styles.technologies}>
      <ManagementModal
        isActive={isActive}
        setIsActive={setIsActive}
        selectedTechnologies={selectedTechnologies}
        setSelectedTechnologies={setSelectedTechnologies}
      />

      <i className="fas fa-tag" aria-hidden="true"></i>

      <div className={styles.technologiesList}>
        {selectedTechnologies.map((technology, index) => {
          return (
            <span className={styles.technology} key={index}>
              { technology }
            </span>
          );
        })}
      </div>

      <button className={styles.editButton} onClick={() => setIsActive(true)} data-testid="activate-modal-button">
        <i className="fas fa-pencil-alt" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default Technologies;
