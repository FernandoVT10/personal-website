import React, { useState } from "react";

import { gql, useMutation } from "@apollo/client";

import { Input, TextArea } from "@/components/Formulary";

import useForm from "@/hooks/useForm";

import { inputValidators } from "@/utils/validators";

import Loader from "@/components/Loader";

import styles from "./ContactMe.module.scss";

export const SEND_MESSAGE = gql`
  mutation SendMessage($name: String!, $email: String!, $subject: String!, $message: String!) {
    sendMessage(name: $name, email: $email, subject: $subject, message: $message)
  }
`;

type Values = {
  name: string
  email: string
  subject: string
  message: string
}

const ContactMe = () => {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [sendMessage, { loading, data, error }] = useMutation(SEND_MESSAGE);

  const { notify, validateForm } = useForm();

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if(!validateForm()) return console.log("holi");

    sendMessage({
      variables: values
    });
  }

  const handleInputOnChange = (value: string, name: string) => {
    setValues({...values, [name]: value});
  }

  return (
    <div className={styles.contactMe}>
      <div className={styles.form}>
        { loading &&
        <div className={styles.loaderContainer} data-testid="contactme-loader">
          <Loader/>
        </div>
        }

        <h3 className={styles.title}>Contact Me</h3>

        <form onSubmit={handleOnSubmit}>
          <Input
            name="name"
            label="Name"
            notify={notify}
            onChange={handleInputOnChange}
            inputProps={{
              required: true
            }}
          />

          <Input
            name="email"
            label="Email"
            notify={notify}
            onChange={handleInputOnChange}
            inputProps={{
              required: true
            }}
            validator={inputValidators.email}
          />

          <Input
            name="subject"
            label="Subject"
            notify={notify}
            onChange={handleInputOnChange}
            inputProps={{
              required: true
            }}
          />

          <TextArea
            name="message"
            label="Message"
            notify={notify}
            onChange={handleInputOnChange}
            textareaProps={{
              required: true
            }}
          />

          { error && 
          <div className={styles.error}>
            <i className="fas fa-times-circle"></i>
            There was an error trying to send the message. Try it again later.
          </div>
          }

          { data ?
            <p className={styles.successMessage}>Your message has been sent correctly.</p>
            :
            <button type="submit" className={`${styles.submitButton} submit-button`}>Send Message</button>
          }
        </form>
      </div>

      <div className={styles.moreInfo}>
        <h3 className={styles.title}>You can also contact me on my social networks!</h3>

        <div className={styles.socialNetworksContainer}>
          <a className={styles.socialNetwork} href="https://twitter.com/FernandoVT10">
            <i className="fab fa-github" aria-hidden="true"></i>
            <span className={styles.username}>@FernandoVT10</span>
          </a>

          <a className={styles.socialNetwork} href="https://twitter.com/FernandoVT10">
            <i className="fab fa-twitter" aria-hidden="true"></i>
            <span className={styles.username}>@FernandoVT10</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactMe;
