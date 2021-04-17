import React, { useState } from "react";

import { Input, TextArea } from "@/components/Formulary";

import { email as emailValidator } from "@/utils/validators";

import styles from "./ContactMe.module.scss";

const ContactMe = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className={styles.contactMe}>
      <div className={styles.leftSide}>
        <h3 className={styles.title}>Contact Me</h3>

        <img
          src="/img/contact-me.svg"
          className={styles.image}
          alt="Envelope"
        />
      </div>

      <div className={styles.form}>
        <form>
          <Input
            prefix="email"
            label="Email"
            value={email}
            setValue={setEmail}
            validator={emailValidator}
          />

          <TextArea
            prefix="message"
            label="Message"
            value={message}
            setValue={setMessage}
          />

          <button type="submit" className={`${styles.submitButton} submit-button`}>Send Message</button>
        </form>
      </div>
    </div>
  );
}

export default ContactMe;
