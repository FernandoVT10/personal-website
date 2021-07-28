import React, { useState } from "react";

import { gql, Reference, useMutation } from "@apollo/client";

import { Input } from "@/components/Formulary";
import Loader from "@/components/Loader";

import styles from "./CreateTechnology.module.scss";

const CREATE_TECHNOLOGY = gql `
  mutation createTechnology($name: String!) {
    createTechnology(name: $name) {
      _id
      name
    }
  }
`;

interface IMutationResult {
  createTechnology: {
    _id: string
    name: string
  }
}

const CreateTechnology = () => {
  const [createTechnology, createTechnologyResult] = useMutation<IMutationResult>(CREATE_TECHNOLOGY, {
    update(cache, { data: { createTechnology: newTechnology } }) {
      cache.modify({
        fields: {
          technologies(existingTechnologies: Reference[] = []) {
            return [...existingTechnologies, newTechnology];
          },
        },
      });
    }
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [technologyName, setTechnologyName] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    try {
      await createTechnology({
        variables: { name: technologyName }
      });

      setTechnologyName("");
      setIsActive(false);
    } catch(e) {
      setErrorMessage(e.message);
    }
    
  }

  if(isActive) {
    return (
      <div className={styles.createTechnology}>
        <form onSubmit={handleForm}>
          <div className={styles.form}>
            <Input
              prefix="create-technology-name"
              label="Name"
              value={technologyName}
              setValue={setTechnologyName}
            />

            { errorMessage.length > 0 &&
            <p className={styles.errorMessage}>
              { errorMessage }
            </p>
            }

            { createTechnologyResult.loading ?
              <div className={styles.loaderContainer}>
                <Loader/>
              </div>
              :
              <div className={styles.buttons}>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => setIsActive(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.button}>Create</button>
              </div>
            }
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.createTechnology}>
      <button className={styles.createButton} onClick={() => setIsActive(true)}>
        <i className="fas fa-plus"></i>
        Create new technology
      </button>
    </div>
  );
}

export default CreateTechnology;
