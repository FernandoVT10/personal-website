import React, { useState } from "react";

import { gql, useMutation } from "@apollo/client";

import { Input, TextArea } from "@/components/Formulary";

import { email as emailValidator } from "@/utils/validators";

import MessageCard from "@/components/MessageCard";
import Loader from "@/components/Loader";

import styles from "./ContactMe.module.scss";

const SEND_MESSAGE = gql`
  mutation SendMessage($name: String!, $email: String!, $subject: String!, $message: String!) {
    sendMessage(name: $name, email: $email, subject: $subject, message: $message)
  }
`;

const ContactMe = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [sendMessage, { loading, data, error }] = useMutation(SEND_MESSAGE);

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if(emailValidator(email)) return;

    sendMessage({
      variables: { name, email, subject, message }
    });
  }

  return (
    <div className={styles.contactMe}>
      <div className={styles.form}>
        { loading &&
        <div className={styles.loaderContainer}>
          <Loader/>
        </div>
        }

        <h3 className={styles.title}>Contact Me</h3>

        <form onSubmit={handleOnSubmit}>
          <Input
            prefix="name"
            label="Name"
            value={name}
            setValue={setName}
          />

          <Input
            prefix="email"
            label="Email"
            value={email}
            setValue={setEmail}
            validator={emailValidator}
          />

          <Input
            prefix="subject"
            label="Subject"
            value={subject}
            setValue={setSubject}
          />

          <TextArea
            prefix="message"
            label="Message"
            value={message}
            setValue={setMessage}
          />

          {error && 
          <div className={styles.error}>
            <i className="fas fa-times-circle"></i>
            { error.message }
          </div>
          }
          {data ?
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
