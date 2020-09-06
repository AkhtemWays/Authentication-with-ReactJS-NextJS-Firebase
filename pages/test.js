import React, { useState, useCallback } from "react";
import styles from "../styles/Home.module.css";
import verifyEmail from "../firebase/emailSendConfig";
export default function test() {
  return (
    <div className={styles.container}>
      <button onClick={verifyEmail}>Verify Email</button>
    </div>
  );
}
