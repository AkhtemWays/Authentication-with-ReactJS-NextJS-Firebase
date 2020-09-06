import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/Home.module.css";
import Firebase from "../firebase/config";
import { useRouter } from "next/router";
import Link from "next/link";

export default function signin() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  useEffect(() => {
    Firebase.getAuthState().then((serverUser) => {
      if (!serverUser) {
        // navigate back
        router.replace("/signin");
      } else {
        setUser(serverUser);
      }
    });
  }, []);
  const handleClick = useCallback((ev) => {
    Firebase.logout();

    router.push("/signin");
  });
  const sendEmail = (ev) => {
    console.log(Firebase.getCurrentUser());
    Firebase.getCurrentUser()
      .SendEmailVerificationAsync()
      .ContinueWith((task) => {
        if (task.IsCanceled) {
          Debug.LogError("SendEmailVerificationAsync was canceled.");
          return;
        }
        if (task.IsFaulted) {
          Debug.LogError(
            "SendEmailVerificationAsync encountered an error: " + task.Exception
          );
          return;
        }

        Debug.Log("Email sent successfully.");
      });
  };
  return user ? (
    <div className={styles.container}>
      <h1>Hello {user.email}</h1>
      <button onClick={handleClick}>Logout</button>
      <Link href="/test">
        <a>Go to test page</a>
      </Link>
      <button onClick={sendEmail}>Update Email</button>
    </div>
  ) : (
    <div className={styles.container}>Loading...</div>
  );
}
