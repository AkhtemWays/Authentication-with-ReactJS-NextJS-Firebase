import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/Home.module.css";
import Firebase from "../firebase/config";
import { useRouter } from "next/router";
import Link from "next/link";
import verifyEmail from "../firebase/emailSendConfig";

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

  return user ? (
    <div className={styles.container}>
      <h1>Hello {user.email}</h1>
      <button onClick={handleClick}>Logout</button>
      <Link href="/test">
        <a>Go to test page</a>
      </Link>

      <button onClick={verifyEmail}>Verify Email</button>

      <Link href="/email-update">
        <a>Update Email</a>
      </Link>
    </div>
  ) : (
    <div className={styles.container}>Loading...</div>
  );
}
